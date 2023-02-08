fetch("db/starwars-full-interactions-allCharacters.json").then(response => response.json()).then(data => {
    console.log(data);
    var nodes = data.nodes;
    //set nodes id to index of node
    for (var i = 0; i < nodes.length; i++) {
        nodes[i].id = i;
    }
    const links = data.links;

    const width = window.innerWidth;
    const height = window.innerHeight;

    var svg = d3.select("body").append("svg")
        .attr("width", width)
        .attr("height", height)
        .style("background-color", "#222222");

    var simulation = d3.forceSimulation(nodes)
        .force("link", d3.forceLink(links).id(function (d) { return d.id; }))
        .force("charge", d3.forceManyBody().strength(-50))
        .force("center", d3.forceCenter(width / 2, height / 2))
        .force("gravity", d3.forceManyBody().strength(-100));

    var link = svg.selectAll(".link")
        .data(links)
        .enter().append("line")
        .attr("class", "link")
        .attr("stroke-width", 1)
        .attr("stroke", "#555555")
        .attr("opacity", 1);

    var node = svg.selectAll(".node")
        .data(nodes)
        .enter().append("circle")
        .attr("class", "node")
        .attr("r", 10)
        .attr("fill", function (d) { return d.colour; })
        .call(d3.drag()
            .on("start", (event, d) => {
                if (!event.active) {
                    simulation.alphaTarget(0.3).restart();
                    d.fx = d.x;
                    d.fy = d.y;
                }
            })
            .on("drag", (event, d) => { d.fx = event.x; d.fy = event.y; })
            .on("end", (event, d) => {
                if (!event.active) {
                    simulation.alphaTarget(0);
                    d.fx = null;
                    d.fy = null;
                }
            }));

    // tooltip
    var tooltip = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

    simulation
        .nodes(nodes)
        .on("tick", ticked);

    simulation.force("link")
        .links(links);

    function ticked() {
        link
            .attr("x1", function (d) { return d.source.x; })
            .attr("y1", function (d) { return d.source.y; })
            .attr("x2", function (d) { return d.target.x; })
            .attr("y2", function (d) { return d.target.y; });

        node
            .attr("cx", function (d) { return d.x; })
            .attr("cy", function (d) { return d.y; });
    }

    function dragstarted(d) {
        if (!d3.event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
    }

    function dragged(d) {
        d.fx = d3.event.x;
        d.fy = d3.event.y;
    }

    function dragended(d) {
        if (!d3.event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
    }

    function tooltipIn(d) {
        tooltip.transition()
            .duration(200)
            .style("opacity", .9);
        tooltip.html(d.name)
            .style("left", (d3.event.pageX) + "px")
            .style("top", (d3.event.pageY - 28) + "px");
    }

    function tooltipOut(d) {
        tooltip.transition()
            .duration(500)
            .style("opacity", 0);
    }

    node.on("mouseover", (event, d) => {
        tooltip.transition()
            .duration(200)
            .style("opacity", .9);
        tooltip.html(d.name)
            .style("position", "absolute")
            .style("font-family", "sans-serif")
            .style("left", (20) + "px")
            .style("top", (28) + "px");
        
            // enlarge target node
            d3.select(this).attr('transform', 'scale(1.5)');
    })
        .on("mouseout", (event, d => {
            tooltip.transition()
                .duration(500)
                .style("opacity", 0);
            tooltip.html("");
        }));

    //zoom and pan
    var zoom_handler = d3.zoom()
        .on("zoom", (event) => {
            g.attr("transform", event.transform);
        });
});