import Point from "./test.js"

console.log(112231222)
const flow = new Flow({
    testMethod:false,
    target: 'http://localhost:3000/upload',
    query: {
        upload_token: 'my_token'
    }
});
// Flow.js isn't supported, fall back on a different method
if (!flow.support) location.href = '/some-old-crappy-uploader';

flow.assignBrowse(document.getElementById('browseButton'));
flow.assignDrop(document.getElementById('dropTarget'));

flow.on('fileAdded', function(file, event) {
    console.log(file, event);
});
flow.on('fileSuccess', function(file, message) {
    console.log(file, message);
});
flow.on('fileError', function(file, message) {
    console.log(file, message);
});

document.getElementById('uploadButton').onclick = function(e) {
    flow.upload();
}


const point = new Point(1, 2);
console.log(point)
