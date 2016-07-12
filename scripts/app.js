$(document).ready(function() {
    
    //Colours
    var $white = '#fff';
    var $black = '#111';
    var $blue = '#0f2228';
    var $green = '#535c43';
    var $yellow = '#cc9900';
    var $red = '#692d21';
    
    //global variables
    var $vis = $('.right');
    var width = $vis.width();
    var sankeyH;
    var langH = 200;
    var circles;
    var innerR;
    var outerR;
    var langText;
    var formatPercent = d3.format('%');
    
    //check for window width to set sankeyH, innerR, outerR
    if ($(window).width() >= 768) {
        sankeyH = 650;
        innerR = 70;
        outerR = 80;
    } else {
        sankeyH = 500;
        innerR = 45;
        outerR = 55;
    }
    
   
    //append SVG to #sankey
    var sankeySVG = d3.select('#sankey').append('svg')
        .attr({
            width: width,
            height: sankeyH
        });
    
    //append SVG to #languange
    var langSVG = d3.select('#language').append('svg')
        .attr({
            width: width,
            height: langH
        });
    
    //append g to sankeySVG
    var sankeyG = sankeySVG.append('g')
        .attr({
            class: 'sankeyG'
        });
    
    //append g to langSVG
    var langG = langSVG.append('g')
        .attr({
            class: 'langG'
        });
    
    
    //gradient data
    var gradientData = [
        {lang: 'swe', color: $yellow},
        {lang: 'eng', color: $red},
    ];
    
    //set up linear gradient
    var defs = langSVG.append('defs').selectAll('linearGradient')
        .data(gradientData)
        .enter().append('linearGradient')
        .attr({
            id: function(d) {
                return 'gradient-' + d.lang;
            },
            x1: '0%',
            x2: '0%',
            y1: '100%',
            y2: '0%'
        });

    defs.append('stop')
    .attr({
        offset: '0%'
    })
    .style({
        'stop-color': function(d) {
            return d.color;
        }
    });

    defs.append('stop')
    .attr({
        offset: '0%'
    })
    .style({
        'stop-color': function(d) {
            return d.color;
        },
        'stop-opacity': 0
    });

    
    //draw circles for langSVG
    function drawCircles() {
        
        //set data for circles
        var circlePositions = [
            {id: 'a',class: 'outer swedish', cx: width / 4, cy: 100, r: outerR, lang: 'swe'},
            {id: 'b', class: 'inner swedish', cx: width / 4, cy: 100, r: innerR, text1: 'Swedish', text2: 0.00, text3: 'Native'},   
            {id: 'c',class: 'outer english', cx: (width / 4) * 3, cy: 100, r: outerR, lang: 'eng'},
            {id: 'd',class: 'inner english', cx: (width / 4) * 3, cy: 100, r: innerR, text1: 'English', text2: 0.00, text3: 'Fluent'}
        ]; 
        
        circles = langG.selectAll('circle')
            .data(circlePositions)
            .enter().append('circle')
            .attr({
                class: function(d) {
                    return d.class;
                },
                id: function(d) {
                    return d.id;
                },
                cx: function(d) {
                    return d.cx;
                },
                cy: function(d) {
                        return d.cy;
                    },
                r: function(d) {
                        return d.r;
                    },
            });
        
        //set fill for outer circles
        d3.selectAll('circle.outer')
            .style({
                stroke: function(d) {
                    return 'url(#gradient-' + d.lang + ')';
                },
                'stroke-width': '10px'
            });
        
        //append text
        circleText('Swedish', width / 4, 'Native');
        circleText('English', (width / 4) * 3, 'Fluent');
        
    }   //end function drawCircles
    
    
    function circleText(language, xval, level) {
        
        //append text to langG
        langText = langG.append('text')
            .attr({
                x: xval,
                y: 85,
                'text-anchor': 'middle',
                class: language
            })
            .text(language);
        
        langText.append('tspan')
            .attr({
                dy: 20,
                x: xval,
                id: 'textPercent',
                class: language
            })
            .text('0%');
        
        langText.append('tspan')
            .attr({
                dy: 20,
                x: xval,
                class: language
            })
            .text(level);
    }
    
    
    function updateCircles() {
        
        defs.selectAll('stop')
            .transition()
                .duration(1500)
                .ease('cubic-in-out')
                .attr({
                    offset: '100%'
                });
        
        langText.selectAll('tspan#textPercent')
            .transition()
            .duration(1500)
            .ease('cubic-in-out')
            .tween('text', tweenText(1))
        
    }   //end function updateCircles
    
    
    //tween between percent values
    function tweenText( newValue ) {
        return function() {
            var i = d3.interpolate( 0, newValue );

            return function(t) {
              d3.selectAll('tspan#textPercent').text(formatPercent(i(t)));
            };
        }
    }   //end tweentext
    
    
    //call drawCircles
    drawCircles();
    //temporary click function to display circle transition
    $('circle').click(updateCircles);
    
    
    
    
    
    
    
    ////////////////////////////////////////
    ///////     RESIZE FUNCTION     ////////
    ////////////////////////////////////////
    
    $(window).resize(function() {
        
        //update width and height variables
        width = $vis.width();
        
        //check for window width to set sankeyH
        if ($(window).width() >= 768) {
            sankeyH = 650;
            innerR = 70;
            outerR = 80;
        } else {
            sankeyH = 500;
            innerR = 45;
            outerR = 55;
        }
        
        
        //update vis SVG's height and width
        sankeySVG.attr({width: width, height: sankeyH});
        langSVG.attr({width: width});
        
        
        
        //update circle positions
        d3.selectAll('circle.swedish').attr({cx: width / 4});        
        d3.selectAll('circle.english').attr({cx: (width / 4) * 3});
        d3.selectAll('circle.inner').attr({r: innerR});
        d3.selectAll('circle.outer').attr({r: outerR});
        
        
        //Update circle text
        d3.selectAll('text.Swedish').attr({x: width / 4});
        d3.selectAll('tspan.Swedish').attr({x: width / 4});
        d3.selectAll('text.English').attr({x: (width / 4) * 3});
        d3.selectAll('tspan.English').attr({x: (width / 4) * 3});
    });     //end function resize
    
    
}); //end all