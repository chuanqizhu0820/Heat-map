fetch('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json')
.then(response => response.json())
.then(data => {
    console.log(data);
    const baseTemp = data.baseTemperature;
    const subTitle = document.querySelector("#sub-title");
    subTitle.textContent = `1753 - 2015: base temperature ${baseTemp}℃`;

    const width = 1050;
    const height = 600;
    const paddingLeft = 50;
    const paddingBottom = 50;
    const cellWidth = 4;
    const cellHeight = 50;
    const svg = d3.select('svg')
                .attr('width', `${width+paddingLeft}`)
                .attr('height', `${height+paddingBottom}`);

    svg
      .append('g')
      .selectAll('rect')
      .data(data.monthlyVariance)
      .enter()
      .append('rect')
      .attr('classed','cell')
      .attr('data-month', (d)=>`${d.month}`)
      .attr('data-year', (d)=>`${d.year}`)
      .attr('data-temp', (d)=>`${d.variance+baseTemp}`)
      .attr('width', `${cellWidth}`)
      .attr('height', `${cellHeight}`)
      .attr('x',(d,i)=>`${Math.floor(i/12)*4+paddingLeft}`)
      .attr('y',(d,i)=>`${(i%12)*50}`)
      .attr('fill', (d)=>
        {
          return `rgb(${128+128*d.variance/baseTemp},128,${128-128*d.variance/baseTemp})`
        })
       .on('mouseover', (d)=>{
           
       })
        
    const xScale = d3.scaleLinear()
                     .domain([1753,2015])
                     .range([0,width]);

    const yScale = d3.scaleBand()
                     .domain(['Jan', 'Feb', 'Mar','Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'])
                     .range([0,600]);

    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale);

    svg
    .append('g')
    .attr('id', 'x-axis')
    .attr("transform", `translate(`+`${paddingLeft}`+`,`+`${height}`+`)`)
    .call(xAxis)

    svg
    .append('g')
    .attr('id', 'y-axis')
    .attr("transform", `translate(`+`${paddingLeft}`+`,`+`0)`)
    .call(yAxis);
} );