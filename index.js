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

    const tooltip = d3.select('body')
                      .append('div')
                      .attr("id", "tooltip")
                      .style('opacity','0')

    const colorArr = ['#FF0000', '#FF8000', '#FFFF00', '#00FFFF','#0080FF','#0000FF'];

    const monthList = ['January', 'February', 'March','April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    function getMonth(num){
        return monthList[num];
    }
                      
    svg
      .append('g')
      .selectAll('rect')
      .data(data.monthlyVariance)
      .enter()
      .append('rect')
        .attr('class','cell')
        .attr('data-month', (d)=>`${d.month-1}`)
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
       .on('mouseover', function(e,d){
           d3.select(this).style("stroke", "black");
           tooltip.attr('data-year', `${d.year}`).style('opacity','1')

       })
       .on('mousemove', function(e,d){
           const xp = e.pageX;
           const yp = e.pageY;
           tooltip.html(`<p>${d.year}-${getMonth(d.month-1)}</p><p>${(d.variance+baseTemp).toFixed(2)}</p><p>${d.variance}°C</p>`)
                  .style('position', 'absolute')
                  .style("left",`${xp+10}px`)
                  .style("top", `${yp-50}px`)
                  .style('background-color', 'white')
                  .style('padding', '5px')
                  .style('border-radius', '5px')
       })
       .on('mouseout', function(e,d){
           d3.select(this).style("stroke", "none");
           tooltip.style('opacity','0');
       })
        
    const xScale = d3.scaleLinear()
                     .domain([1753,2015])
                     .range([0,width]);

    let tickArr = []
    for(let i=xScale.domain()[0];i<=xScale.domain()[1];i++){
        if (i%10===0){
            tickArr.push(i)
        }
    };

    const yScale = d3.scaleBand()
                     .domain(monthList)
                     .range([0,height]);

    const xAxis = d3.axisBottom(xScale).tickValues(tickArr).tickFormat(function (year) {
      var date = new Date(0);
      date.setUTCFullYear(year);
      var format = d3.timeFormat('%Y');
      return format(date);
    });
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

    d3.select('#legend')
      .append('g')
      .selectAll('rect')
      .data(colorArr)
      .enter()
      .append('rect')
      .attr('width','50px')
      .attr('height','50px')
      .attr('x', (d,i)=>`${i*50}`)
      .attr('fill',(d)=>`${d}`)
      .text('hello')
} );

