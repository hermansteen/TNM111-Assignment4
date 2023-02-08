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
        .attr("height", height);

    var simulation = d3.forceSimulation(nodes)
        .force("link", d3.forceLink(links).id(function (d) { return d.id; }))
        .force("charge", d3.forceManyBody().strength(-50))
        .force("center", d3.forceCenter(width / 2, height / 2))
        .force("gravity", d3.forceManyBody().strength(-25))
        .force("collide", d3.forceCollide().radius(10));

    var link = svg.selectAll(".link")
        .data(links)
        .enter().append("line")
        .attr("class", "link")
        .attr("stroke-width", 2)
        .attr("stroke", "#555555")
        .attr("opacity", 0.5);

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

    var tooltipTitle = tooltip.append("h1").attr("class", "tooltip-title");
    var tooltipSubtitle = tooltip.append("h2").attr("class", "tooltip-subtitle");

    simulation
        .nodes(nodes)
        .on("tick", ticked);

    simulation.force("link")
        .links(links)
        .distance(150)
        .strength(0.1)
        .iterations(5);

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

    node.on("mouseover", (event, d) => {
        d3.select(event.target).transition(200).attr("r", 15);
        tooltip.transition()
            .duration(200)
            .style("opacity", .9);
        tooltipSubtitle.transition()
            .duration(200)
            .style("opacity", .9);
        tooltipTitle.html(d.name)
            .style("position", "absolute")
            .style("font-family", "sans-serif")
            .style("left", (20) + "px")
            .style("top", (28) + "px");
        tooltipSubtitle.html("Appears in: " + d.value + " scenes").style("position", "absolute")
            .style("font-family", "sans-serif")
            .style("left", (20) + "px")
            .style("top", (70) + "px");
    })
        .on("mouseout", (event, d => {
            tooltip.transition()
                .duration(50)
                .style("opacity", 0);
            d3.select(event.target).transition(200).attr("r", 10);
        }));

    link.on("mouseover", (event, d) => {
        d3.select(event.target).transition(200).attr("stroke-width", 3);
        tooltip.transition()
            .duration(200)
            .style("opacity", .9);
        tooltipSubtitle.transition()
            .duration(200)
            .style("opacity", .9);
        tooltipTitle.html(d.source.name + " - " + d.target.name)
            .style("position", "absolute");
    })
        .on("mouseout", (event, d) => {
            tooltip.transition()
                .duration(50)
                .style("opacity", 0);
            d3.select(event.target).transition(200).attr("stroke-width", 1);
        });

    //zoom and pan
    var zoom_handler = d3.zoom()
        .on("zoom", (event) => {
            g.attr("transform", event.transform);
        });
});