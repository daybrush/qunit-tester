/*
 * qunit-tester
 * http://daybrush.com
 *
 * Copyright (c) 2017 Daybrush.
 * Licensed under the MIT license.
 */

'use strict';


function concatenatePath(url, url2) {
    let path = url.split("/");
    path.pop();

    let path2 = url2.split("/");
    path = path.concat(path2);
    for(let i = path.length - 1; i>=0; --i) {
        if(i === 0)
            break;
        switch(path[i]) {
            case ".":
                path.splice(i, 1);
                continue;
            case "":
                path.splice(i, 1);
                continue;
        }
    }

    return path.join("/");
}
function getPathLevel(path) {
    var paths = path.split("/");
    paths.pop();
    paths = paths.filter(function(folder) {
        return folder !== "." && folder !== "";
    });
    var level = paths.length;
    paths.forEach(function(folder) {
        if(folder === "..")
            --level;
    });
    
    return level;
}
function makeDotPath(level, file) {
    var path1 = [];
    for(var i = 0; i < level; ++i) {
        path1.push("..");
    }
    if(file) {
        path1.push(file);
    }
    return path1.join("/");
}
function makeHTML(title, dest, path, target) {
    var targetLevel = getPathLevel(target);
    if(dest.indexOf("http") !== 0) {
        var level = getPathLevel(path +"/" + target);
        dest = concatenatePath(makeDotPath(level, "1"), dest);
    }
    var testpath = makeDotPath(targetLevel, ".");
    
    return `<html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width">
      <title>${title} QUnit Test</title>
      <link rel="stylesheet" href="${testpath}/css/qunit.css">
    </head>
    <body>
        <div id="qunit"></div>
        <div id="qunit-fixture"></div>
        <script src="${testpath}/js/qunit.js"></script>
        <script src="${dest}"></script>
        <script src="${testpath}/js/${target}.js"></script>
    </body>
    </html>`;
}
module.exports = function(grunt) {
    grunt.registerMultiTask('tester', 'make qunit tester.', function() {
        this.files.forEach(function(f) {
            var test = f.test;
            var title = f.title;
            var dest = f.dest;
            var target = f.target;
            grunt.file.write(test + target +".html", makeHTML(title, dest, test, target));
        });
    });
}