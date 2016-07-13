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
    
    //check for window width to set sankeyH, width, innerR, outerR
    if ($(window).width() >= 768) {
        
        sankeyH = 600;
    } else {
        sankeyH = 450;
    }
    
    
    ////////////    SVG's setup      ////////////////
    //append SVG to #sankey
    var sankeySVG = d3.select('#sankey').append('svg')
        .attr({
            width: width,
            height: sankeyH
        });
    
    //append g to sankeySVG
    var sankeyG = sankeySVG.append('g')
        .attr({
            class: 'sankeyG'
        });
    
    
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
        
        
    ////////////////////////////////////////
    ///////     RESIZE FUNCTION     ////////
    ////////////////////////////////////////
    
    $(window).resize(function() {
        
        width = $vis.width();;
        
        //check for window width to set sankeyH, width, innerR, outerR
        if ($(window).width() >= 768) {
            sankeyH = 600;
        } else {
            sankeyH = 450;
        }
        
        
        //update vis SVG's height and width
        sankeySVG
            .attr({width: width, height: sankeyH});
        
        //update sankey width
        sankey
            .size([width, sankeyH]);
        
        //reset sankey
        sankey
            .nodes(sankeyGraph.nodes)
            .links(sankeyGraph.links)
            .layout(32);
        
        //Update node positioning
        node
            .attr("transform", function(d) { 
                return "translate(" + d.x + "," + d.y + ")"; 
            });
        
        //Update rect height
        d3.selectAll('rect')
            .attr("height", function(d) { return d.dy; 
            });
        
        //update links
        link
            .attr("d", sankeyPath);
        
        //update text positioning
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