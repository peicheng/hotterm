(function () {
    var urlParams = new URLSearchParams(window.location.search);
    var date = new Date();
    date.setMinutes(date.getMinutes() - 6);
    if (urlParams.has('d')) {
        var queryd = urlParams.get('d');
        var url = geturl(queryd.slice(0, 4) + '/' + queryd.slice(4, 6) + '/' + queryd.slice(6, 8) + '/' + queryd);
    } else {
        var queryd = dateToYMD(date).slice(-11);
        var url = geturl(dateToYMD(date));
    }           

    //$('meta[property="og\\:title"]').attr("content", "http://peicheng.github.io/"+window.location.pathname + "?" + urlParams);

    var toc = document.createElement('div');
    toc.className = "toc";
    var block = document.createElement('div');
    block.className = "row";
    var colmd1_div = document.createElement('div');
    colmd1_div.className = "col-md-1";
    //block.appendChild(colmd1_div);
    var list_div = document.createElement('div');
    list_div.className = "col-md-10";
    list_div.setAttribute("id", "termblock");

    var terms_list = new Array();
    var title_list = new Array();
    $.get(url, function (data, status) {
        console.log('info: ' + data.indexOf('\n'));
        if (data.indexOf('\n') == -1) {
            //'old'
            var splitflag = false;
            var lines = data.split('{"term"');
        } else {
            var splitflag = true;
            var lines = data.split('\n');
        }

        lines.forEach(function (line, index) {
            try {
                if (splitflag) {
                    var j = JSON.parse(line);
                } else {
                    var j = JSON.parse('{"term"' + line);
                }
                terms_list.push(j);
                let title = document.createElement('h2');
                title.setAttribute("id", "title" + index);
                title.className = "anchor";
                title.innerText = j.term
                list_div.appendChild(title);
                title_list.push(j.term);

                let summary = document.createElement('p');
                summary.innerText = j.summary;
                list_div.appendChild(summary);

                let links_ul = document.createElement('ul');
                j.links.forEach(function (l) {
                    let li = document.createElement('li');
                    li.innerHTML = "<a href='" + l.url + "' target='_blank'> " + l.title + "</a> " + l.t;
                    links_ul.appendChild(li);
                });
                list_div.appendChild(links_ul);
                //toc
                toc.innerHTML += "<a href='#title" + index + "'>" + j.term + "</a><br>";

            } catch (e) {
                console.log('line ' + line);
                console.log(e);
            }
        });
        $("meta[property='og:description']").attr("content", title_list.join(" ") + " 熱門關鍵字");
        $("meta[property='og:url']").attr("content", "http://peicheng.github.io/" + window.location.pathname + "?" + urlParams);
    $("meta[property='og:title']").attr("content", queryd.slice(0, 8) + ' ' + queryd.slice(9) + '時 熱門關鍵字');
        var m = document.createElement('meta');
        m.name = 'description';
        m.content = title_list.join(" ") + " 熱門關鍵字";
        document.head.appendChild(m);
    }).fail(function () {
        //alert('zzz' + status);
    });
    var sidebar = document.createElement('div');
    sidebar.className = "col-md-2";
    sidebar.setAttribute("id", "sidebar");
    block.appendChild(list_div);
    block.appendChild(sidebar);
    $('#content').append(block);
    $('#content').prepend(toc);
    genTodayListToSidebar(queryd);
    genThisMonthDayListToSidebar(getThisMonthDayList());
    //add headline
    $('#termblock').prepend('<h1>' + queryd.slice(0, 8) + ' ' + queryd.slice(9) + '時 熱門關鍵字</h1>');

    if (urlParams.has('d')) {
    } else {
        urlParams.append('d', queryd)
    }
    window.history.pushState(null, null, window.location.pathname + "?" + urlParams);
    document.title = "Hot Term " + queryd;


})();
function genContent(term_list) {
    term_list.forEach(function (d) {

    });
}
function dateToYMD(date) {
    var d = date.getDate();
    var m = date.getMonth() + 1; //Month from 0 to 11
    var y = date.getFullYear();
    var h = date.getHours();
    m = (m <= 9 ? '0' + m : m);
    d = (d <= 9 ? '0' + d : d);
    h = (h <= 9 ? '0' + h : h);
    return y + '/' + m + '/' + d + '/' + y + m + '' + d + '_' + h;
}
function geturl(d) {
    var url_prefix = "https://raw.githubusercontent.com/peicheng/hotterm/master/";
    return url_prefix + d + '_hotterm.json'
}
$(document).ready(function () {
    $(document).on('click', '.ui-btn-top', function (evt) {
        evt.preventDefault();
        $('html, body').animate({ scrollTop: 0 }, 300); //http://api.jquery.com/animate/
    });
});
function getDayLinks() {
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth();
    var yyyy = today.getFullYear();
    /*
    if(dd<10){
        dd = '0'+dd
    } 
    if(mm<10){
        mm = '0'+mm
    } */
    console.log(yyyy + ' ' + mm)
    //console.log(getDaysInMonth(4, 2012))
    console.log(getDaysInMonth(mm, yyyy))

}
function getThisMonthDayList() {
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth();
    var yyyy = today.getFullYear();
    return getDaysInMonth(mm, yyyy);
}
/**
* @param {int} The month number, 0 based
* @param {int} The year, not zero based, required to account for leap years
* @return {Date[]} List with date objects for each day of the month
*/
function getDaysInMonth(month, year) {
    // Since no month has fewer than 28 days
    var date = new Date(year, month, 1);
    var days = [];
    console.log('month', month, 'date.getMonth()', date.getMonth())
    var m = month + 1;
    while (date.getMonth() === month) {
        //days.push(new Date(date));
        days.push(year + "" + (m < 10 ? '0' : '') + m + "" + (date.getDate() < 10 ? '0' : '') + date.getDate());
        date.setDate(date.getDate() + 1);
    }
    return days;
}
function genTodayListToSidebar(queryd) {
    $('#sidebar').append("<div id='todaylist'><h3>本日熱門</h3><ul></ul></div>");
    let todaydiv = $("#todaylist").find('ul');;
    //20181012_01
    for (i = 0; i < 24; i++) {
        let link = window.location.pathname + "?d=" + queryd.slice(0, 8) + "_" + (i < 10 ? "0" + i : i);
        let text = queryd.slice(0, 4) + '-' + queryd.slice(4, 6) + '-' + queryd.slice(6, 8) + " " + (i < 10 ? "0" + i : i);
        todaydiv.append("<li><a href='" + link + "'>" + text + "</a></li>");
    }
    $('#sidebar').append(todaydiv);

}
function genThisMonthDayListToSidebar(daylist) {
    //queryd 20181010
    $('#sidebar').append("<div id='thismonthlist'><h3>本月熱門</h3><ul></ul></div>");
    let todaydiv = $("#thismonthlist").find('ul');;
    //20181012_01
    daylist.forEach(function (queryd) {
        let link = window.location.pathname + "?d=" + queryd.slice(0, 8) + "_12";
        let text = queryd.slice(0, 4) + '-' + queryd.slice(4, 6) + '-' + queryd.slice(6, 8);
        todaydiv.append("<li><a href='" + link + "'>" + text + "</a></li>");
    });
    $('#sidebar').append(todaydiv);

}
