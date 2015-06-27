$(document).ready(function() {
	function openProject (project) {
		console.log("openproject:" + project);
		window.scrollTo(0, 0);
		$(".content").empty();
		var text;
		var vid;
		$.get("assets/" + project + "/text.txt", function(data) {
			text = data.split("\n");
		}, "text").success (function(jqXHR) {
			$.get("assets/" + project + "/vid.txt", function(data) {
				vid = data.split("\n");
			}, "text").success (function(jqXHR){
				var order;
				$.get("assets/" + project + "/order.txt", function(data) {
					order = data.split("\n");
				}, "text").success (function(jqXHR) {
					var textPos = 0;
					var imgPos = 1;
					var vidPos = 0;
					for (var a = 0 ; a < order.length ; a++) {
						if (order[a].search("txt") !== -1) {
							if (a > 0 && order[a-1].search("txt") === -1) {
								$(".content").append("<p class='content-text afterImg'>" + text[textPos] + "</p>");
							}
							else {
								$(".content").append("<p class='content-text'>" + text[textPos] + "</p>");
							}
							textPos++;
						}
						else if (order[a].search("vid") !== -1) {
							$(".content").append("<div class='video'><div><iframe frameborder='0' allowfullscreen='' src='" + vid[vidPos] + "'></iframe></div></div>");
							vidPos++;
						}
						else {
							$(".content").append("<img class='content-item' src='assets/" + project + "/" + imgPos + "." + order[a] + "'>");
							imgPos++;
						}
					}
					var prev = curPage === 0 ? projects.length-3 : curPage-3;
					var next = curPage === projects.length-3 ? 0 : curPage+3;
					$(".content").append("<div class='nav-wrapper'><a class ='nav' id='prev' href='#" + projects[prev] + "'>Previous</a><a class='nav' id='next' href='#" + projects[next] + "'>Next</a></div>");
					location.hash = project;
					console.log("switched to:" + location.hash);
				});
});
});
}
function checkHash() {
	var page = location.hash.substring(1, location.hash.length);
	console.log("check hash:" + page);
	if (page !== "") {
		var index = projectNum(page);
		if (index !== -1) {
			console.log("curpage" + curPage + " index" + index);
			if (curPage !== index) {
				curPage = index;
				openProject(page, curPage);
			}
			return;
		}
		else {
			return;
		}
	}
	setupCovers();
}
function projectNum (project) {
	for (var a = 0 ; a < projects.length ; a+=3) {
		if (projects[a] === project) {
			return a;
		}
	}
	return -1;
}
function setupCovers() {
	if (curPage !== -1) {
		$(".content").empty();
		for (var a = 0 ; a < projects.length ; a+=3) {
			projects[a] = projects[a].trim();
			$(".content").append("<div class='cover-wrapper' id='" + projects[a] + "-w'><a href='#" + projects[a] + "'><div class='cover-text'><span class='cover-title' id='" + projects[a] + "-title'>" + projects[a+1] + "</span><span class='cover-desc' id='" + projects[a] + "-desc'>" + projects[a+2] + "</span></div><img class='cover' id='" + projects[a] + "-cover' src='assets/" + projects[a] + "/0.jpg'></a></div>");
		}
		$(".cover-title, .cover-desc").css("opacity", 0);
		curPage = -1;
	}
}

var projects;
var curPage;
$.get("assets/projects.txt", function(data) {
	projects = data.split("\n");
	for (var a = 0 ; a < projects.length ; a++) {
		projects[a] = projects[a].trim();
	}
}, "text").success (function (jqXHR) {
	$(".content").on("mouseover", ".cover-wrapper", function() {
		var id = "#" + $(this).attr("id").substr(0, $(this).attr("id").length - 2);
		$(id + "-cover").stop().fadeTo(250, 0.4);
		$(id + "-title" + ", " + id + "-desc").stop().fadeTo(250, 1.5);
	});
	$(".content").on("mouseleave", ".cover-wrapper", function() {
		var id = "#" + $(this).attr("id").substr(0, $(this).attr("id").length - 2);
		$(id + "-title" + ", " + id + "-desc").stop().fadeTo(250, 0);
		$(id + "-cover").stop().fadeTo(250, 1);
	});
	checkHash();
	$(window).on("hashchange", function() {
		console.log("found:" + location.hash);
		checkHash();
	});
});
});