$(document).ready(function() {
    
    //Colours
    var $white = '#fff';
    var $black = '#111';
    var $blue = '#0f2228';
    var $red = '#7a6364';
    var $dBlue = '#132f3b';
    var $mBlue = '#294a51';
    var $dGreen = '#55605a';
    var $mGreen = '#7a7863';
    var $tan = '#a2846a';
    var $lTan = '#c8a98c';
    var $lGray = '#e9e9e9';
    
    //global variables
    var $vis = $('.right');
    var width = $vis.width();
    var sankeyH;
//    var langH = 200;
//    var circles;
//    var innerR;
//    var outerR;
//    var langText;
//    var formatPercent = d3.format('%');
    
    //check for window width to set sankeyH, width, innerR, outerR
    if ($(window).width() >= 768) {
        
        sankeyH = 600;
//        innerR = 70;
//        outerR = 80;
    } else {
        sankeyH = 450;
//        innerR = 45;
//        outerR = 55;
    }
    
    
    ////////////    SVG's setup      ////////////////
    //append SVG to #sankey
    var sankeySVG = d3.select('#sankey').append('svg')
        .attr({
            width: width,
            height: sankeyH
        });
    
//    //append SVG to #languange
//    var langSVG = d3.select('#language').append('svg')
//        .attr({
//            width: width,
//            height: langH
//        });
    
    //append g to sankeySVG
    var sankeyG = sankeySVG.append('g')
        .attr({
            class: 'sankeyG'
        });
    
//    //append g to langSVG
//    var langG = langSVG.append('g')
//        .attr({
//            class: 'langG'
//        });
//    
    
    /////////////   Sankey setup    ////////////////
    
    var sankeyGraph;
    var node;
    var link;
    var rect;
    
    // Set the sankey diagram properties
    var sankey = d3.sankey()
        .nodeWidth(10)
        .nodePadding(10)
        .size([width, sankeyH]);

    var sankeyPath = sankey.link();
    
    //queue data
    queue()
        .defer(d3.json, 'data/sankey.json')
        .await(pushData);
    
    
    
    //load data
    function pushData(error, sankeyData) {

        if (error) throw error;
        
        //Update global variable with sankeyData
        sankeyGraph = sankeyData;
        //draw sankey
        drawSankey();
        
    };
    
    
    
    
    ////////////    Gradient setup  ////////////////
    //gradient data
//    var gradientData = [
//        {link: 0, color: $mBlue},
//        {link: 1, color: $mGreen},
//        {link: 2, color: $tan},
//        {link: 3, color: $red}
//    ];
//    
//    //set up linear gradient
//    var defs = sankeySVG.append('defs').selectAll('linearGradient')
//        .data(gradientData)
//        .enter().append('linearGradient')
//        .attr({
//            id: function(d) {
//                return 'gradient-' + d.link;
//            },
//            x1: '0%',
//            x2: '0%',
//            y1: '100%',
//            y2: '0%'
//            //spreadMethod: 'reflect'
//        });
//
//    defs.append('stop')
//    .attr({
//        offset: '0%'
//    })
//    .style({
//        'stop-color': function(d) {
//            return d.color;
//        }
//    });
//
//    defs.append('stop')
//    .attr({
//        offset: '100%'
//    })
//    .style({
//        'stop-color': $dGreen
//    });
    
//    defs.append("animate")
//		.attr("attributeName","x1")
//		.attr("values","0%;100%")
//		.attr("dur","7s")
//		.attr("repeatCount","indefinite");
//		
//	defs.append("animate")
//		.attr("attributeName","x2")
//		.attr("values","100%;200%")
//		.attr("dur","7s")
//		.attr("repeatCount","indefinite");

    
    ////////////    Sankey Skills   /////////////////
    //draw sankey
    function drawSankey() {
        
        sankey
            .nodes(sankeyGraph.nodes)
            .links(sankeyGraph.links)
            .layout(32);
        
        // add in the links
        link = sankeySVG.append('g').selectAll(".link")
            .data(sankeyGraph.links)
            .enter().append("path")
            .attr({
                class: 'link',
                d: sankeyPath,
                id: function(d) {
                    return 'link' + d.source.node;
                }
            })
            .style({
                'stroke-width': 2,
                'stroke-dasharray': '2,2'
            })
            .sort(function(a, b) { return b.dy - a.dy; });
        
        // add in the nodes
        node = sankeySVG.append('g').selectAll(".node")
            .data(sankeyGraph.nodes)
            .enter().append("g")
            .attr({
                class: 'node',
                transform: function(d) {
                    return "translate(" + d.x + "," + d.y + ")";
                }
            });
        
        rect = node.append("rect")
            .attr({
                height: function(d) {
                    return d.dy;
                },
                width: sankey.nodeWidth(),
                rx: 5,
                ry: 5,
                id: function(d, i) {
                    return 'id' + i;
                }
            })
            .on('mouseover', function(d) {
            
                //check if source or target of link are same as hovered node and set class active/inactive
                d3.selectAll('.link').classed('active', function(p) { 
                    return p.source === d || p.target === d; 
                });
                d3.selectAll('.link').classed('inactive', function(p) { 
                    return p.source !== d && p.target !== d; 
                });
                
            
                console.log(d);
                var nodeId = 'textId' + d.node;
                var sourceLength = d.sourceLinks.length;
                var targetLength = d.targetLinks.length;
                
                //set active class on text node of hovered element
                $('text#' + nodeId).addClass('active');
                
                //loop through source and target links to set active class on text
                if (sourceLength !== 0) {
                   for (var i = 0; i < sourceLength; i++) {
                       var tNodeId = 'textId' + d.sourceLinks[i].target.node;
                       
                       $('text#' + tNodeId).addClass('active');       
                    } 
                } else if (targetLength !== 0) {
                    for (var i = 0; i < targetLength; i++) {
                        var tNodeId = 'textId' + d.targetLinks[i].source.node;
                       
                       $('text#' + tNodeId).addClass('active');         
                    } 
                }
                            
                //set hovered node as class active
                d3.select(this).classed('active', true);
                
                
            })
            .on('mouseout', function(d) {
                
                //remove active and inactive classes
                d3.selectAll('.active').classed('active', false);
                d3.selectAll('.inactive').classed('inactive', false);
            
            });
        
        node
            .append("text")
            .attr({
                x: -20,
                y: function(d) {
                    return d.dy / 3 * 2;
                },
                dy: '.01em',
                'text-anchor': 'end',
                id: function(d) {
                    return 'textId' + d.node;
                }
            })
            .text(function(d) { return d.name; })
            .filter(function(d) {
                return d.x < width / 2;
            })
            .attr({
                y: function(d) {
                    return d.dy / 2;
                },
                x: 6 + sankey.nodeWidth(),
                'text-anchor': 'start'
            });
       
    }
    
    
    
    ////////////    Sankey hover events //////////////
    function sankeyOver(d) {
        
        link.selectAll('.link').classed('active', function(p) { 
            return p.source === d || p.target === d; 
        });
        link.selectAll('.link').classed('inactive', function(p) { 
            return p.source !== d && p.target !== d; 
        });
        
        d3.select(this).classed('active', true);
        
        link.selectAll('.link.active')
            .style({
                'stroke-opacity': 0.7
            });
        
        link.selectAll('.link.inactive')
            .style({
                'stroke-opacity': 0.1
            });
        
    }   //end sankeyOver function
    
    
    ////////////    Language SKills  ////////////////
    //draw circles for langSVG
//    function drawCircles() {
//        
//        //set data for circles
//        var circlePositions = [
//            {id: 'a',class: 'outer swedish', cx: width / 4, cy: 100, r: outerR, lang: 'swe'},
//            {id: 'b', class: 'inner swedish', cx: width / 4, cy: 100, r: innerR, text1: 'Swedish', text2: 0.00, text3: 'Native'},   
//            {id: 'c',class: 'outer english', cx: (width / 4) * 3, cy: 100, r: outerR, lang: 'eng'},
//            {id: 'd',class: 'inner english', cx: (width / 4) * 3, cy: 100, r: innerR, text1: 'English', text2: 0.00, text3: 'Fluent'}
//        ]; 
//        
//        circles = langG.selectAll('circle')
//            .data(circlePositions)
//            .enter().append('circle')
//            .attr({
//                class: function(d) {
//                    return d.class;
//                },
//                id: function(d) {
//                    return d.id;
//                },
//                cx: function(d) {
//                    return d.cx;
//                },
//                cy: function(d) {
//                        return d.cy;
//                    },
//                r: function(d) {
//                        return d.r;
//                    },
//            });
//        
//        //set fill for outer circles
//        d3.selectAll('circle.outer')
//            .style({
//                stroke: function(d) {
//                    return 'url(#gradient-' + d.lang + ')';
//                },
//                'stroke-width': '10px',
//                'stroke-dasharray': '8,4,2,2,2,4'
//            });
//        
//        //append text
//        circleText('Swedish', width / 4, 'Native');
//        circleText('English', (width / 4) * 3, 'Fluent');
//        
//    }   //end function drawCircles
//    
//    
//    function circleText(language, xval, level) {
//        
//        //append text to langG
//        langText = langG.append('text')
//            .attr({
//                x: xval,
//                y: 85,
//                'text-anchor': 'middle',
//                class: language
//            })
//            .text(language);
//        
//        langText.append('tspan')
//            .attr({
//                dy: 20,
//                x: xval,
//                id: 'textPercent',
//                class: language
//            })
//            .text('0%');
//        
//        langText.append('tspan')
//            .attr({
//                dy: 20,
//                x: xval,
//                class: language
//            })
//            .text(level);
//    }
//    
//    
//    function updateCircles() {
//        
//        defs.selectAll('stop')
//            .transition()
//                .duration(1500)
//                .ease('cubic-in-out')
//                .attr({
//                    offset: '100%'
//                });
//        
//        langText.selectAll('tspan#textPercent')
//            .transition()
//            .duration(1500)
//            .ease('cubic-in-out')
//            .tween('text', tweenText(1))
//        
//    }   //end function updateCircles
    
    
//    //tween between percent values
//    function tweenText( newValue ) {
//        return function() {
//            var i = d3.interpolate( 0, newValue );
//
//            return function(t) {
//              d3.selectAll('tspan#textPercent').text(formatPercent(i(t)));
//            };
//        }
//    }   //end tweentext
//    
//    
//    //call drawCircles
//    drawCircles();
//    //temporary click function to display circle transition
//    $('circle').click(updateCircles);
    
    
    
    
    
    
    
    ////////////////////////////////////////
    ///////     RESIZE FUNCTION     ////////
    ////////////////////////////////////////
    
    $(window).resize(function() {
        
        width = $vis.width();;
        
        //check for window width to set sankeyH, width, innerR, outerR
        if ($(window).width() >= 768) {
            sankeyH = 600;
//            innerR = 70;
//            outerR = 80;
        } else {
            sankeyH = 450;
//            innerR = 45;
//            outerR = 55;
        }
        
        
        //update vis SVG's height and width
        sankeySVG.attr({width: width, height: sankeyH});
        //langSVG.attr({width: width});
        
        
        
        //update circle positions
//        d3.selectAll('circle.swedish').attr({cx: width / 4});        
//        d3.selectAll('circle.english').attr({cx: (width / 4) * 3});
//        d3.selectAll('circle.inner').attr({r: innerR});
//        d3.selectAll('circle.outer').attr({r: outerR});
//        
//        
//        //Update circle text
//        d3.selectAll('text.Swedish').attr({x: width / 4});
//        d3.selectAll('tspan.Swedish').attr({x: width / 4});
//        d3.selectAll('text.English').attr({x: (width / 4) * 3});
//        d3.selectAll('tspan.English').attr({x: (width / 4) * 3});
        
        sankey.size([width, sankeyH]);
        d3.selectAll(".link").attr({d: sankeyPath});
        
        sankey
            .nodes(sankeyGraph.nodes)
            .links(sankeyGraph.links)
            .layout(32);
        
        node
            .attr("transform", function(d) { 
                return "translate(" + d.x + "," + d.y + ")"; 
            });
            
        d3.selectAll('rect').attr("height", function(d) { return d.dy; });
        
        link
            .attr("d", sankeyPath);
        
        d3.selectAll('text')
            .attr({
                y: function(d) {
                    return d.dy / 3 * 2;
                }
            });
        
        d3.selectAll('text')
            .filter(function(d) {
                return d.x < width / 2;
            })
            .attr({
                y: function(d) {
                    return d.dy / 2;
                }
            });
        
           
        
    });     //end function resize
    
    
}); //end all