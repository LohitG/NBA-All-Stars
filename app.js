function final_project(){
    var filePath="data.csv";
    question1(filePath);
    question2(filePath);
    question2_5(filePath);
    question3(filePath);
    question4(filePath);
}



var question1=function(filePath){
    d3.csv('nba_clean.csv').then(function(data){
        console.log(data)

                // set the dimensions and margins of the graph
        var margin = {top: 10, right: 30, bottom: 30, left: 60},
            width = 660 - margin.left - margin.right,
            height = 600 - margin.top - margin.bottom;

        // append the svg object to the body of the page
        var svg = d3.select("#q1_plot")
        .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
        .append("g")
            .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");


        var max_minutes = 35 - -d3.max(data, function(d){ return d.MP;})
        // Add X axis
        var x = d3.scaleLinear()
            .domain([0, max_minutes])
            .range([ 0, width ]);
        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x));

        // Add Y axis
        var max_points = 30 - -d3.max(data, function(d){ return d.PTS;})
        var y = d3.scaleLinear()
            .domain([0, max_points])
            .range([ height, 0]);
        svg.append("g")
            .call(d3.axisLeft(y));

        // Add dots
        svg.append('g')
            .selectAll("dot")
            .data(data)
            .enter()
            .append("circle")
            .attr("cx", function (d) { return x(d.MP); } )
            .attr("cy", function (d) { return y(d.PTS); } )
            .attr("r", 1.5)
            .style("fill", "red")
        function handleZoom(e) {
                d3.select('svg g')
                .attr('transform', e.transform);
            }
        let zoom = d3.zoom()
            .on('zoom', handleZoom);
    
        d3.select('svg')
            .call(zoom);

                // Add X axis label
        svg.append("text")
        .attr("text-anchor", "end")
        .attr("x", width)
        .attr("y", height + margin.top + 20)
        .text("Average Minutes Played");

        // Add Y axis label
        svg.append("text")
        .attr("text-anchor", "end")
        .attr("transform", "rotate(-90)")
        .attr("y", -margin.left + 20)
        .attr("x", -margin.top)
        .text("Average Points Scored");

        // Add chart title
        svg.append("text")
        .attr("x", (width / 2))
        .attr("y", 0 - (margin.top / 2) + 50)
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .style("text-decoration", "underline")
        .text("NBA Players: Average Minutes Played vs. Points Scored");
    });
}

var question2=function(filePath){
    d3.csv('nba_clean.csv').then(function(data){
        // set the dimensions and margins of the graph
        var margin = {top: 30, right: 130, bottom: 70, left: 60},
        width = 460 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;

        // append the svg object to the body of the page
        var svg = d3.select("#q2_plot")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");


        data = data.filter(function(d){ return d.MP >= 20 })
        const max_pts = 15;
        var temp = d3.rollup(data, v => d3.mean(v, d => d.PTS), d => d.Pos)
        console.log(temp);
        const decsending = new Map([...temp.entries()].sort((a, b) => b[1] - a[1]));
        const ascending = new Map([...temp.entries()].sort((a, b) => a[1] - b[1]));
        // X axis
        var x = d3.scaleBand()
        .range([ 0, width ])
        .domain(["PG", "SG", "SF", "PF", "C"])
        .padding(0.2);
        svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x))
        .selectAll("text")
        .attr("transform", "translate(-10,0)rotate(-45)")
        .style("text-anchor", "end");

        // Add Y axis
        var y = d3.scaleLinear()
        .domain([0, max_pts])
        .range([ height, 0]);
        svg.append("g")
        .call(d3.axisLeft(y));

        // Bars
        svg.selectAll("mybar")
        .data(data)
        .enter()
        .append("rect")
        .attr("x", function(d) { return x(d.Pos); })
        .attr("y", function(d) { return y(temp.get(d.Pos)); })
        .attr("width", x.bandwidth())
        .attr("height", function(d) { return height - y(temp.get(d.Pos)); })
        .attr("fill", "red")

                // Add title
        svg.append("text")
        .attr("x", (width / 2))
        .attr("y", 0 - (margin.top / 2))
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .style("text-decoration", "underline")
        .text("Average Points by Position");

        // Add x-axis label
        svg.append("text")
        .attr("transform", "translate(" + (width/2) + "," + (height + margin.bottom - 10) + ")")
        .style("text-anchor", "middle")
        .text("Position");

        // Add y-axis label
        svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("Average Points per Game");

        var legend = svg.append("g")
        .attr("class", "legend")
        .attr("transform", "translate(" + (width - 100) + "," + 20 + ")");

        legend.append("rect")
        .attr("x", 100)
        .attr("y", 0)
        .attr("width", 10)
        .attr("height", 10)
        .attr("fill", "red");

        legend.append("text")
        .attr("x", 120)
        .attr("y", 10)
        .attr("dy", ".35em")
        .style("text-anchor", "start")
        .text("Points per game");

        var sortOrder = true;
        function sortData() {
            d3.select("#q2_plot").select('svg').remove(); 
            if(sortOrder) {
                            // append the svg object to the body of the page
                    var svg = d3.select("#q2_plot")
                    .append("svg")
                    .attr("width", width + margin.left + margin.right)
                    .attr("height", height + margin.top + margin.bottom)
                    .append("g")
                    .attr("transform",
                        "translate(" + margin.left + "," + margin.top + ")");
                    // X axis
                    var x = d3.scaleBand()
                    .range([ 0, width ])
                    .domain(Array.from(decsending.keys()))
                    .padding(0.2);
                    svg.append("g")
                    .attr("transform", "translate(0," + height + ")")
                    .call(d3.axisBottom(x))
                    .selectAll("text")
                    .attr("transform", "translate(-10,0)rotate(-45)")
                    .style("text-anchor", "end");

                    // Add Y axis
                    var y = d3.scaleLinear()
                    .domain([0, max_pts])
                    .range([ height, 0]);
                    svg.append("g")
                    .call(d3.axisLeft(y));

                    // Bars
                    svg.selectAll("mybar")
                    .data(data)
                    .enter()
                    .append("rect")
                    .attr("x", function(d) { return x(d.Pos); })
                    .attr("y", function(d) { return y(temp.get(d.Pos)); })
                    .attr("width", x.bandwidth())
                    .attr("height", function(d) { return height - y(temp.get(d.Pos)); })
                    .attr("fill", "red")

                    // Add title
                    svg.append("text")
                    .attr("x", (width / 2))
                    .attr("y", 0 - (margin.top / 2))
                    .attr("text-anchor", "middle")
                    .style("font-size", "16px")
                    .style("text-decoration", "underline")
                    .text("Average Points by Position");

                    // Add x-axis label
                    svg.append("text")
                    .attr("transform", "translate(" + (width/2) + "," + (height + margin.bottom - 10) + ")")
                    .style("text-anchor", "middle")
                    .text("Position");

                    // Add y-axis label
                    svg.append("text")
                    .attr("transform", "rotate(-90)")
                    .attr("y", 0 - margin.left)
                    .attr("x", 0 - (height / 2))
                    .attr("dy", "1em")
                    .style("text-anchor", "middle")
                    .text("Average Points per Game");
                    var legend = svg.append("g")
                    .attr("class", "legend")
                    .attr("transform", "translate(" + (width - 100) + "," + 20 + ")");

                    legend.append("rect")
                    .attr("x", 100)
                    .attr("y", 0)
                    .attr("width", 10)
                    .attr("height", 10)
                    .attr("fill", "red");

                    legend.append("text")
                    .attr("x", 120)
                    .attr("y", 10)
                    .attr("dy", ".35em")
                    .style("text-anchor", "start")
                    .text("Points per game");
            }
            else {

                var svg = d3.select("#q2_plot")
                    .append("svg")
                    .attr("width", width + margin.left + margin.right)
                    .attr("height", height + margin.top + margin.bottom)
                    .append("g")
                    .attr("transform",
                        "translate(" + margin.left + "," + margin.top + ")");
                    // X axis
                    var x = d3.scaleBand()
                    .range([ 0, width ])
                    .domain(Array.from(ascending.keys()))
                    .padding(0.2);
                    svg.append("g")
                    .attr("transform", "translate(0," + height + ")")
                    .call(d3.axisBottom(x))
                    .selectAll("text")
                    .attr("transform", "translate(-10,0)rotate(-45)")
                    .style("text-anchor", "end");

                    // Add Y axis
                    var y = d3.scaleLinear()
                    .domain([0, max_pts])
                    .range([ height, 0]);
                    svg.append("g")
                    .call(d3.axisLeft(y));

                    // Bars
                    svg.selectAll("mybar")
                    .data(data)
                    .enter()
                    .append("rect")
                    .attr("x", function(d) { return x(d.Pos); })
                    .attr("y", function(d) { return y(temp.get(d.Pos)); })
                    .attr("width", x.bandwidth())
                    .attr("height", function(d) { return height - y(temp.get(d.Pos)); })
                    .attr("fill", "red")

                                        // Add title
                    svg.append("text")
                    .attr("x", (width / 2))
                    .attr("y", 0 - (margin.top / 2))
                    .attr("text-anchor", "middle")
                    .style("font-size", "16px")
                    .style("text-decoration", "underline")
                    .text("Average Points by Position");

                    // Add x-axis label
                    svg.append("text")
                    .attr("transform", "translate(" + (width/2) + "," + (height + margin.bottom - 10) + ")")
                    .style("text-anchor", "middle")
                    .text("Position");

                    // Add y-axis label
                    svg.append("text")
                    .attr("transform", "rotate(-90)")
                    .attr("y", 0 - margin.left)
                    .attr("x", 0 - (height / 2))
                    .attr("dy", "1em")
                    .style("text-anchor", "middle")
                    .text("Average Points per Game");

                    var legend = svg.append("g")
                    .attr("class", "legend")
                    .attr("transform", "translate(" + (width - 100) + "," + 20 + ")");

                    legend.append("rect")
                    .attr("x", 100)
                    .attr("y", 0)
                    .attr("width", 10)
                    .attr("height", 10)
                    .attr("fill", "red");

                    legend.append("text")
                    .attr("x", 120)
                    .attr("y", 10)
                    .attr("dy", ".35em")
                    .style("text-anchor", "start")
                    .text("Points per game");
            }
        }

          d3.select("#sort_button")
            .on("click", function() {
                sortData();
                sortOrder = !sortOrder;
            });
    }); 
 }
    

var question2_5 = function(filePath){
   // set the dimensions and margins of the graph
    var margin = {top: 50, right: 100, bottom: 100, left: 50},
    width = 560 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

    // append the svg object to the body of the page
    var svg = d3.select("#q2_5_plot")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");

        // Parse the Data
    d3.csv("nba_clean.csv").then(function(data) {
        // List of subgroups = header of the csv files = soil condition here
        var subgroups = ["PTS", "TRB", "AST"];
        data = data.filter(function(d){ return d.MP >= 20 })
        // List of groups = species here = value of the first column called group -> I show them on the X axis
        var groups = ["PG", "SG", "SF", "PF", "C"]

        const data_r = [
            { Pos: 'PG', PTS: 13.877, TRB: 3.759, AST: 5.246 },
            { Pos: 'SG', PTS: 13.040, TRB: 3.540, AST: 2.953 },
            { Pos: 'SF', PTS: 13.067, TRB: 4.497, AST: 2.262 },
            { Pos: 'PF', PTS: 13.063, TRB: 5.932, AST: 2.245 },
            { Pos: 'C', PTS: 12.788, TRB: 8.137, AST: 2.08 }
          ];
        // Add X axis
        var x = d3.scaleBand()
            .domain(groups)
            .range([0, width])
            .padding([0.2])
        svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x).tickSizeOuter(0));

        // Add Y axis
        var y = d3.scaleLinear()
        .domain([0, d3.max(data_r, function(d){ return d.PTS - -d.TRB - -d.AST;}) - -5])
        .range([ height, 0 ]);
        svg.append("g")
        .call(d3.axisLeft(y));

        // color palette = one color per subgroup
        var color = d3.scaleOrdinal()
        .domain(subgroups)
        .range(['red','blue','green']);

        //stack the data? --> stack per subgroup
        var stackedData = d3.stack()
        .keys(subgroups)
        (data_r)

        // Show the bars
        svg.append("g")
        .selectAll("g")
        // Enter in the stack data = loop key per key = group per group
        .data(stackedData)
        .enter().append("g")
            .attr("fill", function(d) { return color(d.key); })
            .selectAll("rect")
            // enter a second time = loop subgroup per subgroup to add all rectangles
            .data(function(d) { return d; })
            .enter().append("rect")
            .attr("x", function(d) { return x(d.data.Pos); })
            .attr("y", function(d) { return y(d[1]); })
            .attr("height", function(d) { return y(d[0]) - y(d[1]); })
            .attr("width",x.bandwidth())


            // Add title
        svg.append("text")
        .attr("x", (width / 2))             
        .attr("y", 0 - (margin.top / 2))
        .attr("text-anchor", "middle")  
        .style("font-size", "16px") 
        .text("NBA Statistics by Position");

        // Add X axis label
        svg.append("text")             
        .attr("transform", "translate(" + (width/2) + " ," + (height + margin.top) + ")")
        .style("text-anchor", "middle")
        .text("Position");

        // Add Y axis label
        svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x",0 - (height / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("Average PTS + Average TRB + Average AST");

        var legendGroup = svg.append("g")
            .attr("class", "legend")
            .attr("transform", "translate(400, 20)");

        var legendData = ["PTS", "TRB", "AST"];
        var legendRects = legendGroup.selectAll("rect")
                    .data(legendData)
                    .enter()
                    .append("rect")
                    .attr("x", 0)
                    .attr("y", function(d, i) { return i * 20; })
                    .attr("width", 16)
                    .attr("height", 16)
                    .style("fill", function(d) { return color(d); });

        legendGroup.selectAll("text")
        .data(legendData)
        .enter()
        .append("text")
        .attr("x", 20)
        .attr("y", function(d, i) { return i * 20 + 12; })
        .text(function(d) { return d; });
    })

}

var question3=function(filePath){
    var width=500;
    var height=400;
    var margin=50;

    d3.csv('nba_clean.csv').then(function(data){
        var width = 960;
        var height = 500;
        // State Symbol dictionary for conversion of names and symbols.
        var stateSym = {
        AZ: 'Arizona',
        AL: 'Alabama',
        AK: 'Alaska',
        AR: 'Arkansas',
        CA: 'California',
        CO: 'Colorado',
        CT: 'Connecticut',
        DC: 'District of Columbia',
        DE: 'Delaware',
        FL: 'Florida',
        GA: 'Georgia',
        HI: 'Hawaii',
        ID: 'Idaho',
        IL: 'Illinois',
        IN: 'Indiana',
        IA: 'Iowa',
        KS: 'Kansas',
        KY: 'Kentucky',
        LA: 'Louisiana',
        ME: 'Maine',
        MD: 'Maryland',
        MA: 'Massachusetts',
        MI: 'Michigan',
        MN: 'Minnesota',
        MS: 'Mississippi',
        MO: 'Missouri',
        MT: 'Montana',
        NE: 'Nebraska',
        NV: 'Nevada',
        NH: 'New Hampshire',
        NJ: 'New Jersey',
        NM: 'New Mexico',
        NY: 'New York',
        NC: 'North Carolina',
        ND: 'North Dakota',
        OH: 'Ohio',
        OK: 'Oklahoma',
        OR: 'Oregon',
        PA: 'Pennsylvania',
        RI: 'Rhode Island',
        SC: 'South Carolina',
        SD: 'South Dakota',
        TN: 'Tennessee',
        TX: 'Texas',
        UT: 'Utah',
        VT: 'Vermont',
        VA: 'Virginia',
        WA: 'Washington',
        WV: 'West Virginia',
        WI: 'Wisconsin',
        WY: 'Wyoming'
    };



    const data_r = [
        { key: 'PG', PTS: 8.399, TRB: 2.457, AST: 3.284 },
        { key: 'SG', PTS: 7.830, TRB: 2.423, AST: 1.834 },
        { key: 'SF', PTS: 7.426, TRB: 2.959, AST: 1.313 },
        { key: 'PF', PTS: 7.716, TRB: 4.119, AST: 1.289 },
        { key: 'C', PTS: 7.769, TRB: 5.317, AST: 1.208 }
      ];
    console.log(data_r);



    var svg = d3.select("#q3_plot")
            .append("svg")
            .attr("width", width)
            .attr("height", height);

        data = data.filter(function(d){ return d.MP >= 20 })
        state_sales = d3.rollup(data, v => d3.sum(v, d => 1), d => d.st)
        states = Array.from(state_sales.keys())
        const proj = d3.geoAlbersUsa()
            .scale(750)
            .translate([width / 2, height / 2]);
        const pathgeo = d3.geoPath().projection(proj);

        const states_map = d3.json('us-states.json');
        console.log(state_sales)
        states_map.then(function (map) {
            const colorScale = d3.scaleLog()
                .domain([d3.min(state_sales.values()), d3.max(state_sales.values())])
                .range(["lightblue", "darkblue"]);
            console.log(states);
            svg.selectAll('path').data(map.features).enter()
                .append('path')
                .attr('d', pathgeo)
                .attr('fill', d => colorScale(state_sales.get(stateSym[d.properties.name])))
                .attr('fill', function (d) {if(states.includes(d.properties.name)) { return colorScale(state_sales.get(d.properties.name))} else { return "lightblue"} })
                .attr('stroke', 'black')
                .attr('stroke-width', 0.5);
            
                const legend = svg.append('g')
                .attr('class', 'legend')
                .attr('transform', 'translate(750, 250)');

            svg.append("text")
                .attr("x", 500)
                .attr("y", 25)
                .attr("text-anchor", "middle")
                .style("font-size", "20px")
                .text("Total Quality Players per State");

            const legendScale = d3.scaleLog()
                .domain([10, 50])
                .range([0, 150]);
            
            const legendAxis = d3.axisRight(legendScale)
                .ticks(3);
            
            legend.append('rect')
                .attr('width', 20)
                .attr('height', 150)
                .style('fill', 'url(#color-gradient)');
            
            legend.append('g')
                .attr('transform', 'translate(20, 0)')
                .call(legendAxis);
            
            legend.append('text')
                .attr('x', 0)
                .attr('y', -5)
                .attr('text-anchor', 'start')
                .text('Players');
                        
            const linearGradient = svg.append('linearGradient')
                .attr('id', 'color-gradient')
                .attr('x1', '0%')
                .attr('y1', '0%')
                .attr('x2', '0%')
                .attr('y2', '100%');
            
            linearGradient.selectAll('stop')
                .data(colorScale.ticks())
                .enter()
                .append('stop')
                .attr('offset', d => ((d - d3.min(state_sales.values())) / (d3.max(state_sales.values()) - d3.min(state_sales.values()))) * 700 + '%')
                .attr('stop-color', d => colorScale(d));    
            
                
        });
    });
      
}

var question4=function(filePath){
    
    var width=500;
        var height=500;
        var margin={
            top:50,bottom:50,left:50,right:50
        }
    const svg=d3.select("#q4_plot")
                .append("svg")
                .attr("width",width-margin.right-margin.left)
                .attr("height",height-margin.top-margin.bottom)

    function revealData() {

        d3.select("#q4_plot").select('svg').remove(); 

        var data={
            "nodes":[
                {id: 1, name: 'PTS', x: 87, y: 145,avg_pts_score:8,avg_rebound_score:9}, 
                {id: 2, name: 'TRB', x: 176, y: 94,avg_pts_score:2,avg_rebound_score:8},  
                {id: 3, name: 'AST', x: 249, y: 162,avg_pts_score:7,avg_rebound_score:1}, 
                {id: 4, name: 'POS', x: 208, y: 253,avg_pts_score:6,avg_rebound_score:8.5}, 
                {id: 5, name: 'FG%', x: 105, y: 246,avg_pts_score:9,avg_rebound_score:4}, 
            ],
            "edges":[{'source': {id: 1, name: 'PTS', x: 87, y: 145}, 
                      'target':  {id: 2, name: 'TRB', x: 176, y: 94},
                     'chem': 67},
    
                     {'source': {id: 1, name: 'PTS', x: 87, y: 145}, 
                      'target':  {id: 3, name: 'AST', x: 249, y: 162},
                     'chem': 72},
    
                     {'source': {id: 1, name: 'PTS', x: 87, y: 145}, 
                      'target':  {id: 4, name: 'POS', x: 208, y: 253},
                     'chem': 3.1},
    
                     {'source': {id: 1, name: 'PTS', x: 87, y: 145}, 
                      'target':  {id: 5, name: 'FG%', x: 105, y: 246},
                     'chem': 31},
                     
                     {'source': {id: 2, name: 'TRB', x: 176, y: 94}, 
                      'target': {id: 3, name: 'AST', x: 249, y: 162},
                     'chem': 42},
    
                     {'source': {id: 2, name: 'TRB', x: 176, y: 94}, 
                      'target': {id: 4, name: 'POS', x: 208, y: 253},
                     'chem': 43},
    
                     {'source': {id: 2, name: 'TRB', x: 176, y: 94}, 
                      'target':  {id: 5, name: 'FG%', x: 105, y: 246},
                     'chem': 42},
                     
                     {'source': {id: 3, name: 'AST', x: 249, y: 162}, 
                      'target':  {id: 5, name: 'FG%', x: 105, y: 246},
                     'chem': 11},
    
                     {'source': {id: 4, name: 'POS', x: 208, y: 253}, 
                      'target':  {id: 5, name: 'FG%', x: 105, y: 246},
                     'chem': 28},
    
                     {'source': {id: 4, name: 'POS', x: 208, y: 253}, 
                      'target':  {id: 3, name: 'AST', x: 249, y: 162},
                     'chem': 35}
                     ]
            
        }
    
        var width=500;
        var height=500;
        var margin={
            top:50,bottom:50,left:50,right:0
        }
        const svg=d3.select("#q4_plot")
                .append("svg")
                .attr("width",width-margin.right-margin.left)
                .attr("height",height-margin.top-margin.bottom)

        var color = d3.scaleOrdinal().domain(new Set(d3.map(data.nodes, d=>d.continent))).range(['blue', 'red', 'green'])

        data["links"]=[] //use as input to forceSimulation
        for(var i=0;i<data.edges.length;i++){
            var obj={}
            obj["source"]=data.edges[i]["source"].id;
            obj["target"]=data.edges[i]["target"].id;
            obj["chem"]=data.edges[i]["chem"]
            data.links.push(obj);
        }
        var chemScale = d3.scaleLinear().domain([50, 100]).range([1,10])
        console.log(data.links);
        //create edges using "line" elements
        var link = svg.selectAll("line")
        .data(data.links)
        .enter().append("line")
        .attr("stroke", "#ccc")
        .attr("stroke-width", function(d) { return chemScale(d.chem)});

        console.log(data.nodes)
        //create nodes using "circle" elements
        var node = svg.selectAll("circle")
        .data(data.nodes)
        .enter().append("circle")
        .attr("r", 10)
        .attr("fill", 'black  ');

        //create label using "text" elements
        var label = svg.selectAll("text")
        .data(data.nodes)
        .enter().append("text")
            .text(d=> d.name)
            .attr("dx", 12)
            .attr("dy", ".35em");

        //create force graph
        var simulation = d3.forceSimulation(data.nodes)
        .force("link", d3.forceLink(data.links).id(function(d) { return d.id; }))
        .force("charge", d3.forceManyBody())
        .force("center", d3.forceCenter(250, 250));

        // Define the tick function
        function ticked() {
            link
            .attr("x1", function(d) { return d.source.x; })
            .attr("y1", function(d) { return d.source.y; })
            .attr("x2", function(d) { return d.target.x; })
            .attr("y2", function(d) { return d.target.y; });

            node
            .attr("cx", function(d) { return d.x; })
            .attr("cy", function(d) { return d.y; });
            
            label
            .attr("x", function(d) { return d.x; })
            .attr("y", function(d) { return d.y; });
        
        }

        // Update the force simulation with the nodes and links
        //simulation.nodes(node);
        simulation.force("link").links(link);

        // Run the simulation and update the visualization
        simulation.on("tick", ticked);

        svg.append("text")
        .attr("x", 300)
        .attr("y", 100)
        .attr("text-anchor", "middle")
        .style("font-size", "20px")
        .text("Chemistry between the 5 Metrics");
    }


    d3.select("#reveal_button")
            .on("click", function() {
                revealData();
            });
}

