function compute(y,xmin,dx,columns,maxIterations) {
    iterationCounts = [];
    for (var i = 0; i < columns; i++) {
        var x0 = xmin + i * dx;
        var y0 = y;
        var a = x0;
        var b = y0;
        var ct = 0;
        while (a*a + b*b < 4.1) {
            ct++;
            if (ct > maxIterations) {
                ct = -1;
                break;
            }
            var newa = a*a - b*b + x0;
            b = 2*a*b + y0;
            a = newa;
        }
        iterationCounts[i] = ct;
    }
    return iterationCounts;
}

onmessage = function(msg) {
    var job = msg.data;
    counts = compute(job.y,job.xmin,job.dx,job.columns,job.maxIterations);
    postMessage( {
        workerNum: job.workerNum,
        jobNum: job.jobNum,
        row: job.row,
        iterationCounts: counts
    } );
}
