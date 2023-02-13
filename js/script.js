async function getJSON() {
    const response = await fetch("db/starwars-full-interactions-allCharacters.json");
    const data = await response.json();
    return data;
}

async function getEpisodeJson() {
    const ep1 = await fetch("db/starwars-episode-1-interactions-allCharacters.json");
    const ep2 = await fetch("db/starwars-episode-2-interactions-allCharacters.json");
    const ep3 = await fetch("db/starwars-episode-3-interactions-allCharacters.json");
    const ep4 = await fetch("db/starwars-episode-4-interactions-allCharacters.json");
    const ep5 = await fetch("db/starwars-episode-5-interactions-allCharacters.json");
    const ep6 = await fetch("db/starwars-episode-6-interactions-allCharacters.json");
    const ep7 = await fetch("db/starwars-episode-7-interactions-allCharacters.json");

    const ep1Data = await ep1.json();
    const ep2Data = await ep2.json();
    const ep3Data = await ep3.json();
    const ep4Data = await ep4.json();
    const ep5Data = await ep5.json();
    const ep6Data = await ep6.json();
    const ep7Data = await ep7.json();

    console.log(ep1Data);

    for (var i = 0; i < ep1Data.links.length; i++) {
        ep1Data.links[i].episode = 1;
        // write targetName and sourceName to link
        ep1Data.links[i].target = ep1Data.nodes[ep1Data.links[i].target].name;
        ep1Data.links[i].source = ep1Data.nodes[ep1Data.links[i].source].name;
    }
    for (var i = 0; i < ep2Data.links.length; i++) {
        ep2Data.links[i].episode = 2;
        // write targetName and sourceName to link
        ep2Data.links[i].target = ep2Data.nodes[ep2Data.links[i].target].name;
        ep2Data.links[i].source = ep2Data.nodes[ep2Data.links[i].source].name;
    }
    for (var i = 0; i < ep3Data.links.length; i++) {
        ep3Data.links[i].episode = 3;
        // write targetName and sourceName to link
        ep3Data.links[i].target = ep3Data.nodes[ep3Data.links[i].target].name;
        ep3Data.links[i].source = ep3Data.nodes[ep3Data.links[i].source].name;
    }
    for (var i = 0; i < ep4Data.links.length; i++) {
        ep4Data.links[i].episode = 4;
        // write targetName and sourceName to link
        ep4Data.links[i].target = ep4Data.nodes[ep4Data.links[i].target].name;
        ep4Data.links[i].source = ep4Data.nodes[ep4Data.links[i].source].name;
    }
    for (var i = 0; i < ep5Data.links.length; i++) {
        ep5Data.links[i].episode = 5;
        // write targetName and sourceName to link
        ep5Data.links[i].target = ep5Data.nodes[ep5Data.links[i].target].name;
        ep5Data.links[i].source = ep5Data.nodes[ep5Data.links[i].source].name;
    }
    for (var i = 0; i < ep6Data.links.length; i++) {
        ep6Data.links[i].episode = 6;
        // write targetName and sourceName to link
        ep6Data.links[i].target = ep6Data.nodes[ep6Data.links[i].target].name;
        ep6Data.links[i].source = ep6Data.nodes[ep6Data.links[i].source].name;
    }
    for (var i = 0; i < ep7Data.links.length; i++) {
        ep7Data.links[i].episode = 7;
        // write targetName and sourceName to link
        ep7Data.links[i].target = ep7Data.nodes[ep7Data.links[i].target].name;
        ep7Data.links[i].source = ep7Data.nodes[ep7Data.links[i].source].name;
    }

    var allLinks = ep1Data.links.concat(ep2Data.links, ep3Data.links, ep4Data.links, ep5Data.links, ep6Data.links, ep7Data.links);
    var allNodes = ep1Data.nodes.concat(ep2Data.nodes, ep3Data.nodes, ep4Data.nodes, ep5Data.nodes, ep6Data.nodes, ep7Data.nodes);
    // remove duplicates, sum up values 
    allNodes = allNodes.reduce((unique, o) => {
        if (!unique.some(obj => obj.name === o.name)) {
            unique.push(o);
        } else {
            unique.find(obj => obj.name === o.name).value += o.value;
        }
        return unique;
    }, []);
    return { nodes: allNodes, links: allLinks };
}

async function run() {
    var data = await getJSON();
    var epData = await getEpisodeJson();
    data = epData;

    console.log(data);

    var nodes = data.nodes;
    var links = data.links;

    const width = window.innerWidth;
    const height = window.innerHeight;

    var svg = d3.select("body").append("svg")
        .attr("width", width)
        .attr("height", height);

    var simulation = d3.forceSimulation(nodes)
        .force("link", d3.forceLink(links).id(function (d) { return d.name; }))
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

    function changeEpisode(episodeArray) {
        var epLinks = links.filter(function (link) {
            console.log(episodeArray)
            console.log(link.episode)
            console.log(episodeArray.indexOf(7))
            return (episodeArray.indexOf(link.episode) != -1);
        });
        console.log("eplinks",epLinks);
        simulation.force("link").links(epLinks);
        simulation.alpha(1).restart();

        link = link.data(epLinks);
        link.exit().remove();
    }

    //changeEpisode([1, 2, 3])

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

    var episodeSelector = d3.select("#episodeSelector")
        .style("opacity", 1)
        .style("position", "absolute")
        .style("left", (window.innerWidth - 200) + "px")
        .style("top", (window.innerHeight - 200) + "px");

    //get checked episodes and update graph
    episodeSelector.on("change", (event) => {
        var checkedEpisodes = [];
        d3.selectAll("input").each(function (d) {
            cb = d3.select(this);
            if (cb.property("checked")) {
                checkedEpisodes.push(cb.property("value"));
            }
        });
        changeEpisode(checkedEpisodes);
        //console.log(checkedEpisodes);
    });
}
run();