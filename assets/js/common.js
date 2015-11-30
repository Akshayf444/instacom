
/** Disable text highlighting for double clicks */
$.extend($.fn.disableTextSelect = function () {
    return this.each(function () {
        if ($.browser.mozilla) { //Firefox
            $(this).css('MozUserSelect', 'none');
        } else if ($.browser.msie) { //IE
            $(this).bind('selectstart', function () {
                return false;
            });
        } else { //Opera, etc.
            $(this).mousedown(function () {
                return false;
            });
        }
    });
});

/** Numeric only text fields */
$.extend($.fn.numericOnly = function () {
    return this.each(function () {
        $("input.numericOnly").on('blur', function (e) {
            var phoneNumber = $(this).val();
            var intRegex = /^\d+$/;
            if (!intRegex.test(phoneNumber)) {
                $(this).val('');
            }
        });

        $(this).keydown(function (e) {
            var key = e.which || e.keyCode;

            if (!e.shiftKey && !e.altKey && !e.ctrlKey &&
                    // numbers
                    key >= 48 && key <= 57 ||
                    // Numeric keypad
                    key >= 96 && key <= 105 ||
                    // Backspace and Tab and Enter
                    key == 8 || key == 9 || key == 13 ||
                    // Home and End
                    key == 35 || key == 36 ||
                    // left and right arrows
                    key == 37 || key == 39 ||
                    // Del and Ins
                    key == 46 || key == 45) {
                return true;
            } else if (e.ctrlKey) {
                //	ctrl-a		ctrl-c    ctrl-x		ctrl-z
                if (key == 65 || key == 67 || key == 88 || key == 90) {
                    return true;
                } else if (key == 86) {
                    var el = $(this);
                    setTimeout(function () {
                        $(el).val($(el).val().replace(/\D/g, ''));
                    }, 100);
                    return true;
                }
            }
            return false;
        });
    });
});

var getRequests = getQueryStrings();

var messageChanged = false;

var ticketingGroupSet = false;

var insertAreaID = undefined;

var currentActiveAddSender = false;
var currentActiveGroup = false;

//custom select box flag
var selectOpen = false;

var restrictedTemplates = false;

var numericOnly = false;

var noConfDisplay = false;

window.onbeforeunload = function () {
    var isIE = false;

    if ($.browser.msie) {
        isIE = true;
    }

    if (!isIE && messageChanged == true && !noConfDisplay) {
        return 'You will lose your message text...';
    }
}

new function ($) {
    $.fn.setCursorPosition = function (pos) {
        if ($(this).get(0).setSelectionRange) {
            $(this).get(0).setSelectionRange(pos, pos);
        } else if ($(this).get(0).createTextRange) {
            var range = $(this).get(0).createTextRange();
            range.collapse(true);
            range.moveEnd('character', pos);
            range.moveStart('character', pos);
            range.select();
        }
    }
}(jQuery);

$(window).ready(function () {
    if (getRequests["insertSurvey"]) {
        var range = $("#message-body").getSelection();
        caretPos = range.start;
        insertSurveyLink(getRequests["insertSurvey"]);
    }
});



$(document).ready(function () {

    $(document).on('keypress keyup paste', '.senderName', function () {
        $(this).val($(this).val().toString().toUpperCase());
    });

    $('.suppressMsgWarning').mousedown(function () {
        //Trash the Window.onunload function to prevent the dialog box popping up
        window.onbeforeunload = function () {
        };
    });


    $('#langSelector').live('change', function () {
        $('#newlang').val($('#langSelector option:selected').val());
        $('#languageChangeForm').submit();
    });


    $("textarea#message-body").live("change", function () {
        if (!$(this).hasClass("ignore")) {
            messageChanged = true;
        }
    });

    $('#SaveSettings').live("click", function () {
        messageChanged = false;
    });
    $('#saveTemplate').live("click", function () {
        messageChanged = false;
    });
    $('#createTemplate').live("click", function () {
        messageChanged = false;
    });

    $('#saveScheduledAutoresponse').live("click", function () {
        messageChanged = false;
    });

    $('#saveInboxSettings').live("click", function () {
        messageChanged = false;
    });


    $('textarea').bind('input propertychange', function () {
        if (!$(this).hasClass("noBind")) {
            countChars();
        }
    }
    );

    if (document.domain != "control.txtlocal.co.uk" && document.domain != "control.textlocal.in") {
        $(".videoCheck").each(function () {
            $(this).remove();
        });
    }

    $('.keywordValidation').keyup(function () {
        var th = $(this);
        var range = $(this).getSelection();
        caretPos = range.start;
        th.val(th.val().replace(/[^a-zA-Z0-9\-]/g, ''));
        th.setCursorPosition(caretPos);
    });

    // Disable save confirm popup while saving
    $('#grpForwardTemp').live('click', function () {
        noConfDisplay = true;
    });


    /*
     * Javascript form Validation
     *
     **/




    $('.validatableForm').submit(function (e) {
        var _return = true;
        //Design has elements in divs, so get children of form, children on child divs.
        $(this).children().children('.validate:input:not(input[type=hidden])').each(function (idx) {
            if ($(this).val() == '') {
                $(this).css('background', 'none !important').addClass('validateError');
                _return = false;
            }
        });
        return _return;
    });


    $.ajaxSetup({
        contentTypeString: "iso-8859-1"
    });


    JT_init(); //Init the tooltips

    maxchars = 612; //Was overriding page-specific global
    wappushurl = 0;

    /*if ($('.success').length) { //Animate the success message box
     $('.success').animate({opacity: 1.0},3000).animate({backgroundColor:"#ededed",borderTopColor:"#e3e3e3",borderRightColor:"#e3e3e3",borderBottomColor:"#e3e3e3",borderLeftColor:"#e3e3e3"},1000);
     }*/

    /* iphone work arround
     if(navigator.userAgent.match(/(iPad)|(iPhone)|(iPod)|(android)|(webOS)/i))
     {
     $('ul#new-navigation li').click(function() {
     window.location = $(this).children('ul.subnav').children('li:first').find('a').attr('href');
     });
     }
     else
     {
     */

    //------------!!!!!FIX!!!!!-----------//
    /*
     $("#message-body").keyup(function(){
     window.onbeforeunload = function() {
     confirm("You are currently writing a message. Are you sure you want to leave this page? (You will lose any text in this form!)");
     }
     });
     */
    //------------!!!!!FIX!!!!!-----------//

    $('.noSelect').disableTextSelect();

    function isNumeric(n) {
        return !isNaN(parseFloat(n)) && isFinite(n);
    }

    $('.numericOnly').live("keyup", function () {
        numericOnly = $(this);
        var number = $(this).val();
        setTimeout(function () {
            if (!isNumeric(number)) {
                var newNumber = number.replace(/\D/g, '');
                $(numericOnly[0]).val(newNumber);
                numericOnly = false;
            }
        }, 100);
    });

    $('.numericOnly').bind('paste', null, function () {
        numericOnly = $(this);
        setTimeout(function () {
            var number = numericOnly.val();
            if (!isNumeric(number)) {
                var newNumber = number.replace(/\D/g, '');
                $(numericOnly[0]).val(newNumber);
                numericOnly = false;
            }
        }, 100);
    });

    /** Refresh balances every minute */
    updateBalances(true, 60 * 1000);

    /** Init balance buttons */
    $('#balance-container-sms').click(function () {
        window.location = $(this).find('a:first').attr('href');
    });
    $('#balance-container-mms').click(function () {
        window.location = $(this).find('a:first').attr('href');
    });


    $("ul#new-navigation li").hover(
            function () {
                //console.log("ul#new-navigation li hover on");

                $(this).find("ul.subnav").show();
                //$(this).find("ul.subnav").slideDown('fast').show();

                //console.log("showing subnav if exists");

                //var t=setTimeout("removeDropdown()",5000);
                /*
                 $(this).hover(
                 function() {
                 //console.log("ul#new-navigation li this hover on");
                 },
                 function(){
                 //console.log("ul#new-navigation li this hover off");
                 $(this).find("ul.subnav").slideUp('fast');
                 }
                 );
                 */
            }, function () {
        $(this).find("ul.subnav").hide();
        //clearTimeout(t);
        //console.log("ul#new-navigation li hover off");
    }).hover(
            function () {
                //console.log("ul#new-navigation li 2hover on");
                //console.log(" ");
                $(this).addClass("subhover");
            },
            function () {
                //console.log("ul#new-navigation li 2hover off");
                //console.log(" ");
                $(this).removeClass("subhover");
            });

    /*
     }
     */

    if ($("#debug").length) { //Make the "debug" section collapse and toggleable
        $('div#debug pre').toggle();
        $(function () {
            $('div#debug strong').click(function () {
                $('div#debug pre').slideToggle("fast");
            });
        });
    }

    $(".helpHREFClick").click(function () {
        //console.log($(".helpBox").is(":visible"));
        if ($(".helpBox").is(":visible")) {
            $(".helpBox").fadeOut();
        } else {
            $(".helpBox").fadeIn();
            $(".helpBox").find("*").each(function () {
                //ADDS PASS THROUGH CLASS TO ALL CHILDREN to stop helpboc close...
                //$(this).addClass("hrPass");
                $(this).attr("hrpass", "true");
            });
            //$(".helpHREFClick").parent().addClass("subhoverClicked");
            var dynHeight = $(".helpBox").height() - 144;
            $("#helpContent").height(dynHeight);
        }


    });

    $(".helpTool").click(function () {
        var linkText = $(this).attr("link");
        getHelpPage(linkText, true);
    });

    $("#helpBackButton").click(function () {
        var helpPage = $(this).attr("custominfo");
        var helpArr = false;
        if (helpPage.length != 0) {
            getHelpPage(helpPage, false);
            //Don't forget to add HRPASS to data received. (Added in function)
            return false;
        } else {
            return false;
        }
    });

    $(".tipsNextArrow").click(function () {
        $('#tipsSpinner').fadeIn();
        $.ajax({
            url: "/ajax/dash-tips-and-tricks.php",
            type: "POST",
            data: "position=" + $(".tipsNextArrow").attr("position"),
            success: function (data) {
                var tipNum = $(".tipsNextArrow").attr("position");
                if (tipNum == $(".tipsNextArrow").attr("maxposition")) {
                    $(".tipsNextArrow").attr("position", "1");
                } else {
                    tipNum = parseInt(tipNum) + 1;
                    $(".tipsNextArrow").attr("position", tipNum)
                }
                $(".tipsNextArrow").attr("position")
                $("#tipOfTheDayContent").html(data);
                $('#tipsSpinner').fadeOut();
            }
        });
    });

    $("body").click(function (e) {
        //console.log(typeof(e.target.attributes["hrpass"]));
        if (e.target.className !== "helpBox" && e.target.className !== "helpHREFClickTxt menuHelpIcon" && e.target.className !== "helpHREFClick" && e.target.className !== "helpHREFClickTxt" && typeof (e.target.attributes["hrpass"]) == "undefined") {
            $(".helpBox").fadeOut();
            //$(".helpHREFClick").parent().removeClass("subhoverClicked");
        } else {

        }
    });


    $("#helpContent a").live("click", function () {
        var linkText = $(this).attr("link");
        if ($(this).hasClass("newinternal")) {
            window.open(linkText);
            //Go To Text Local in New Tab
        } else if ($(this).hasClass("internal")) {
            window.location = linkText;
            //Go To Text Local in Same Tab
        } else if ($(this).hasClass("external")) {
            window.open(linkText);
            //Go To External Link New Tab
        } else if ($(this).hasClass("highlight")) {
            //Highlight a div or element
            $(linkText).effect("highlight", {}, 500)
            //$(linkText).css("border","1px solid red");
            //console.log($(linkText).eq(0));
            //$(this).effect("transfer", { to: $(linkText).eq(0) }, 500);
        } else if ($(this).hasClass("help")) {
            //Go To Help Page Internal
            getHelpPage(linkText, true);
        } else {
            //Fail
        }
        return false;
    });

    $(".subnav").each(function () {
        $(this).find("li").last().find("a").addClass("bottom");
        $(this).find("li").first().find("a").addClass("top");
    });


    if ($(".sendtabs").length) { //We're on the Send page, so handle the tabs
        $('.sendtabs a').each(function () {
            var str = $(this).attr("href");
            var str = str.replace("/send/?recepient=", "#send-");
            $(this).attr("href", str);
        });
    }

    if ($("#recepient").length) { //We're on the Send page, so make the tab contents dynamically load via AJAX
        initrecepientlist();
        $('#recepient').tabs({//Control the tabs, and AJAX load new tab content
            onClick: function (newtab, newcontent, oldcontent) {
                changeSendTabs(newtab, newcontent, oldcontent);
            },
            onHide: function () {
            },
            onShow: function () {
            }
        });
    }

    $('#savedraft').click(function () {
        if ($('input#message-from-reply2').is(":checked")) {
            var fromname = $('[name="message-from"]').val();
        } else {
            var fromname = "xreplyx";
        }
        $.ajax({
            url: "/ajax/message-save-draft.php",
            type: "POST",
            data: {
                "message": $('#message-body').val(),
                "fromname": fromname,
                "message-unicode": $('#unicode-opt').val()
            },
            dataType: 'json',
            success: function (status) {
                if (status['success']) {
                    $('#savewarning .defNotice .noticeContent').html('Your draft message has been saved.');
                    $('#savewarning .defNotice').removeClass("error");
                    $('#savewarning .defNotice').addClass("success");
                    $('#savewarning').show();

                    messageChanged = false;
                    return;
                } else {
                    $('#savewarning .defNotice .noticeContent').html('1' + status['error'].val());
                    $('#savewarning .defNotice').addClass("error");
                    $('#savewarning .defNotice').removeClass("success");
                    $('#savewarning').show();
                    return;
                }
            },
            error: function () {
                $('#savewarning .defNotice .noticeContent').html('An error occured and we couldn’t save your draft message.');
                $('#savewarning .defNotice').addClass("error");
                $('#savewarning .defNotice').removeClass("success");
                $('#savewarning').show();
                return;
            }
        });
        return false;
    });

    if ($("#message-body").length || $("#message-body-mms").length) { //There's a message box, so handle the limits and alerts
        $('#remainingchars').find(".noticeContent").html("You have used <strong id=\"remainingcharacters\">0</strong> characters.<span id=\"totalmessages\"></span>");
        //Calculate characters entered

        $('#message-body').keyup(function () {

            if ($("#message-wapurl").length) { //There's a WAP URL box, so handle the limits and alerts
                wappushurl = $("#message-wapurl").val().length;
            }

            var position = $(this).val().indexOf("http");
            while (position >= 0) {
                var string = $(this).val().split("");
                if (position - 1 > 0 && string[position - 1] != " " && string[position - 1] != "\r" && string[position - 1] != "\n") {
                    var output = [$(this).val().slice(0, position), " ", $(this).val().slice(position)].join('');
                    $(this).val(output);
                    $("#message-body").setCursorPosition(position);
                }
                position = $(this).val().indexOf('http', position + 2);
            }

            var position = $(this).val().indexOf("www");
            while (position >= 0) {
                var string = $(this).val().split("");
                if (position - 1 > 0 && string[position - 1] != " " && string[position - 1] != "/" && string[position - 1] != "-" && string[position - 1] != "." && string[position - 1] != "_" && string[position - 1] != "+" && string[position - 1] != "&" && string[position - 1] != "=" && string[position - 1] != "?" && string[position - 1] != "\n" && string[position - 1] != "\r") {
                    var output = [$(this).val().slice(0, position), " ", $(this).val().slice(position)].join('');
                    $(this).val(output);
                    $("#message-body").setCursorPosition(position);
                }
                position = $(this).val().indexOf('www', position + 2);
            }
            var spacepos = $(this).val().indexOf("  ");
            if (spacepos >= 0) {
                $(this).val(function (index, value) {
                    return value.replace(/ +/g, ' ');
                });
                $("#message-body").setCursorPosition(spacepos + 1);
            }
            countChars();
        });

        //Add and control the insert buttons
        if (whitelabelcmr) {
            $('#insertbuttons').html(">Insert: <br /><span class=\"button-action\" id=\"insert-FirstName\"><span>FirstName</span></span><span class=\"button-action\" id=\"insert-LastName\"><span>LastName</span></span><span class=\"button-action\" id=\"insert-Custom1\"><span>Custom 1</span></span><span class=\"button-action\" id=\"insert-Custom2\"><span>>Custom 2</span></span><span class=\"button-action\" id=\"insert-Custom3\"><span>>Custom 3</span></span>");
        } else {
            $('#insertbuttons').html(">Insert: <br /><span class=\"button-action\" rel=\"page\" id=\"insert-Page\"><span>>Page</span></span><span class=\"button-action\" id=\"insert-FirstName\"><span>>FirstName</span></span><span class=\"button-action\" id=\"insert-LastName\"><span>>LastName</span></span><span class=\"button-action\" id=\"insert-Custom1\"><span>>Custom 1</span></span><span class=\"button-action\" id=\"insert-Custom2\"><span>>Custom 2</span></span><span class=\"button-action\" id=\"insert-Custom3\"><span>>Custom 3</span></span><span class=\"button-action\" rel=\"page\" id=\"insert-Link\"><span>>Link</span></span>");
        }

        $('#insertbuttons .button-action').bind("click", function () {
            if ($(this).attr("rel") != "page") {
                var insert = "#" + $(this).attr("id").substr(7) + "#";
                insertAtCaret('message-body', insert);
                $("#message-body").focus();
                messageChanged = true;
                countChars();
            }
        });


        $("a[id*='insert']").bind("click", function () {
            if ($(this).attr("id").substr(7) == "Link" || $(this).attr("id").substr(7) == "Link-back" || $(this).attr("id").substr(7) == "Page" || $(this).attr("id").substr(7) == "Page-back" || $(this).attr("id").substr(7) == "Survey" || $(this).attr("id").substr(7) == "Survey-back" || $(this).attr("id").substr(7) == "Date" || $(this).attr("id").substr(7) == "Date-Time" || $(this).attr("id").substr(7) == "UniqueCode" || $(this).attr("id").substr(7) == "Message" || $(this).attr("id").substr(7) == "restricted-input" || $(this).attr("id").substr(7) == "restricted-dropdown") {

            } else {
                var insert = "#" + $(this).attr("id").substr(7) + "#";
                insertAtCaret('message-body', insert);
                $("#message-body").focus();
                messageChanged = true;
                countChars();
                closeInjectBoxes();
            }
        });
    }

    if ($('#insert-Survey').length) {
        $('#insert-Survey').bind("click", function () {
            var range = $("#message-body").getSelection();
            caretPos = range.start;
            loadModal("/content/survey-insert.php");
        });
    }

    if ($('#insert-restricted-input').length) {
        $('#insert-restricted-input').bind("click", function () {
            var range = $("#message-body").getSelection();
            caretPos = range.start;
            loadModal("/content/template-insert-input.php");
        });
    }

    if ($('#insert-restricted-dropdown').length) {
        $('#insert-restricted-dropdown').bind("click", function () {
            var range = $("#message-body").getSelection();
            caretPos = range.start;
            loadModal("/content/template-insert-dropdown.php");
        });
    }

    if ($('#insert-Page').length) {
        $('#insert-Page').bind("click", function () {
            var range = $("#message-body").getSelection();
            caretPos = range.start;
            loadModal("/content/pages-insert.php");
        });
    }

    if ($('#insert-Link').length) {
        $('#insert-Link').bind("click", function () {
            var range = $("#message-body").getSelection();
            caretPos = range.start;
            loadModal("/content/link-insert.php");
        });
    }

    if ($('#insert-Date').length) {
        $('#insert-Date').bind("click", function () {
            var range = $("#message-body").getSelection();
            caretPos = range.start;
            loadModal("/content/date-insert-auto.php");
        });
    }

    if ($('#insert-Date-Time').length) {
        $('#insert-Date-Time').bind("click", function () {
            var range = $("#message-body").getSelection();
            caretPos = range.start;
            loadModal("/content/date-insert.php");
        });
    }

    if ($('#insert-file').length) {
        $('#insert-file').bind("click", function () {
            var range = $("#message-body").getSelection();
            caretPos = range.start;
        });
    }

    if ($('#inject-ticket-code').length) {
        $('#inject-ticket-code').bind("click", function () {
            var range = $("#message-body").getSelection();
            caretPos = range.start;
            loadModal("/content/ticketcode-insert.php");
        });
    }

    if ($('#inject-ticket-link').length) {
        $('#inject-ticket-link').bind("click", function () {
            var msg = $("#message-body").val();
            var range = $("#message-body").getSelection();
            caretPos = range.start;
            if (msg.indexOf("https://tx.gl/t/") > -1) {
                alert("You will not be able to insert multiple ticketing links in a message.");
                return false;
            } else {
                loadModal("/content/ticket-insert.php");
            }
        });
    }

    if ($('#inject-cancel').length) {
        $('#inject-cancel').live("click", function () {
            closeInjectBoxes();
        });
    }

    if ($('#load-inject-custom').length) {
        $('#load-inject-custom').bind("click", function () {
            $("#load-inject-custom-box").fadeIn();
            $("#load-inject-restricted-box").fadeOut();
            $("#load-inject-linksfiles-box").fadeOut();
        });
    }

    if ($('#load-inject-restricted').length) {
        $('#load-inject-restricted').bind("click", function () {
            $("#load-inject-restricted-box").fadeIn();
            $("#load-inject-custom-box").fadeOut();
            $("#load-inject-linksfiles-box").fadeOut();
        });
    }

    if ($('#load-inject-linksfiles').length) {
        $('#load-inject-linksfiles').bind("click", function () {
            $("#load-inject-linksfiles-box").fadeIn();
            $("#load-inject-restricted-box").fadeOut();
            $("#load-inject-custom-box").fadeOut();
        });
    }


    $('#insertDateSeconds').live('change', function () {
        if ($(this).val() == "other") {
            $('#insertDateOtherSeconds').show(300);
        } else {
            $('#insertDateOtherSeconds').hide(300);
        }
    });

    $('#insertDateDate').live('change', function () {
        if ($(this).val() == "other") {
            $('#insertDateOther').show(300);
        } else {
            $('#insertDateOther').hide(300);
        }
    });

    if ($('#scheduled-autoresponders-new').length) {
        $('#scheduled-autoresponders-new').bind("click", function () {
            var query = document.getElementById('inboxid').value;
            tb_show("Select Page", "/messages/scheduled/autoresponders/?id=" + query)
        });
    }

    if ($('#insert-Message').length) {
        $('#insert-Message').bind("click", function () {
            var insert = "#Message#";
            insertAtCaret('message-body', insert);
            $("#message-body").focus();
            messageChanged = true;
            countChars();
        });
    }

    if ($('#insert-SenderNumber').length) {
        $('#insert-SenderNumber').bind("click", function () {
            var insert = "#SenderNumber#";
            insertAtCaret('message-body', insert);
            $("#message-body").focus();
            messageChanged = true;
            countChars();
        });
    }

    if ($('#insert-SenderName').length) {
        $('#insert-SenderName').bind("click", function () {
            var insert = "#SenderName#";
            insertAtCaret('message-body', insert);
            $("#message-body").focus();
            messageChanged = true;
            countChars();
        });
    }

    if ($('#insert-SenderCustom1').length) {
        $('#insert-SenderCustom1').bind("click", function () {
            var insert = "#SenderCustom1#";
            insertAtCaret('message-body', insert);
            $("#message-body").focus();
            messageChanged = true;
            countChars();
        });
    }

    if ($('#insert-SenderCustom2').length) {
        $('#insert-SenderCustom2').bind("click", function () {
            var insert = "#SenderCustom2#";
            insertAtCaret('message-body', insert);
            $("#message-body").focus();
            messageChanged = true;
            countChars();
        });
    }

    if ($('#insert-SenderCustom3').length) {
        $('#insert-SenderCustom3').bind("click", function () {
            var insert = "#SenderCustom3#";
            insertAtCaret('message-body', insert);
            $("#message-body").focus();
            messageChanged = true;
            countChars();
        });
    }

    if ($('#insert-CalendarDate').length) {
        $('#insert-CalendarDate').bind("click", function () {
            var insert = "#Date#";
            insertAtCaret('message-body', insert);
            $("#message-body").focus();
            messageChanged = true;
            countChars();
        });
    }

    if ($('#insert-CalendarTime').length) {
        $('#insert-CalendarTime').bind("click", function () {
            var insert = "#Time#";
            insertAtCaret('message-body', insert);
            $("#message-body").focus();
            messageChanged = true;
            countChars();
        });
    }

    if ($('#insert-CalendarTitle').length) {
        $('#insert-CalendarTitle').bind("click", function () {
            var insert = "#Title#";
            insertAtCaret('message-body', insert);
            $("#message-body").focus();
            messageChanged = true;
            countChars();
        });
    }

    if ($('#insert-CalendarLocation').length) {
        $('#insert-CalendarLocation').bind("click", function () {
            var insert = "#Location#";
            insertAtCaret('message-body', insert);
            $("#message-body").focus();
            messageChanged = true;
            countChars();
        });
    }

    if ($("#message-wapurl").length) { //There's a WAP URL box, so handle the limits and alerts
        $('#message-wapurl').keyup(function () {
            wappushurl = $("#message-wapurl").val().length;
            countChars();
        });
    }

    if ($("#message-body-160").length) { //There's a message box, so handle the limits and alerts
        $('#remainingchars').find(".noticeContent").html("You have <strong id=\"remainingcharacters\">160</strong> characters remaining.<<span id=\"totalmessages\"></span>");
        $('#message-body-160').keyup(countChars160);
    }

    if ($("#message-body-mms").length) { //There's a message box, so handle the limits and alerts
        $('#remainingchars').find(".noticeContent").html("You have used <strong id=\"remainingcharacters\">0</strong> characters.<<span id=\"totalmessages\"></span>");
        $('#message-body-mms').keyup(countCharsMMS);
    }

    if ($("#contactsform").length) { //Contacts Form exists, so handle the submission (detect which submit button is pressed - Delete shows a modal window)
        $("#deletegroup").click(function () {
            var count = 0;
            var type = $('#recepientlist').parent('div').attr('id');
            $('#recepientlist input.recepientcheckbox:checked').each(function () {
                count = count + 1;
            });
            var message = "";
            if (count > 1) {
                if (type == "group") {
                    message = "Are you sure you want to remove these " + count + " groups and all their contacts?";
                }
                if (type == "contacts") {
                    message = "Are you sure you want to remove these " + count + " contacts?";
                }
            } else {
                if (type == "group") {
                    message = "Are you sure you want to remove this group and all its contacts?";
                }
                if (type == "contacts") {
                    message = "Are you sure you want to remove this contact?";
                }
            }
            if (confirm(message)) {
                return true;
            } else {
                return false;
            }
        });
    }

    if ($("#globalcheck").length) { //Checks all checkboxes below
        $("#globalcheck").live('change', function () {
            if ($(this).is(":checked")) {
                $('tbody input.defCheckbox:not(:checked)').siblings("div.defCheckbox").click()
            } else {
                $('tbody input.defCheckbox:checked').addClass("checked").siblings("div.defCheckbox").click();
            }
        });
    }

    if ($('input.indenttoggle').length) {
        $('input.indenttoggle').each(function () {
            if (!$(this).attr("checked")) {
                $(this).parent().next('div.indent').hide();
            }
        });
        $('input.indenttoggle').click(function () {
            $(this).parent().next('div.indent').slideToggle();
        });
    }
    ;

    if ($('input.indenttoggleradio').length) {
        $('input.indenttoggleradio').each(function () {
            if (!$(this).attr("checked")) {
                $(this).parent().next('div.indent').hide();
            }
        });
        $('input.indenttoggleradio').click(function () {
            $(this).parent().siblings('div.indent').slideUp();
            $(this).parent().next('div.indent').slideDown();
        });
    }
    ;

    if ($('form#createuniquecode').length) {
        $("form#createuniquecode").submit(function () {
            var query = $("form#createuniquecode").serializeArray();
            tb_show('', '/contactmanager/uniquecode/', null, query);
            return false;
        });
    }

    if ($('form#sendtextmessage').length) {
        $("form#sendtextmessage").submit(function () {
            var query = $("form#sendtextmessage").serializeArray();
            tb_show('', '/send/confirm/', null, query);
            return false;
        });
    }


    if ($('form#sendmmsmessage').length) {
        $("form#sendmmsmessage").submit(function () {
            var query = $("form#sendmmsmessage").serializeArray();
            tb_show('', '/send/mms/confirm/', null, query);
            return false;
        });
    }

    if ($('#deleteallinbox').length) {
        $("#deleteallinbox").click(function () {
            if (confirm("Are you sure you want to delete ALL the messages from this inbox?\n\nThis action cannot be undone.")) {
                return true;
            } else {
                return false;
            }
        });
    }

    if ($('#importcolumnheader').length) {
        removeImportDupes(null);
        $('#importcolumnheader select').change(removeImportDupes);
    }


    /* TWISTIES */
    initTwisties();

    $('div.twisties .twistieHeader').live("click", function (e) {

        if ($(this).hasClass('twist-down')) {
            $(this).find('.leftToggleArrow').html('&#xf107;');
            $(this).find('.rightToggleArrow').html('&#xf107;');

            if ($(this).find('.defCheckbox').length > 0) {
                $(this).find('input.defCheckbox').prop('checked', false).removeClass('checked');
                $(this).find('div.defCheckbox').removeClass('checked');
                $(this).find('div.defCheckbox').removeClass('checked');
                //$(this).find('input.defCheckbox').change();
            }

            $(this).next().slideUp(100);
        } else {
            $(this).find('.leftToggleArrow').html('&#xf106;');
            $(this).find('.rightToggleArrow').html('&#xf106;');
            if ($(this).find('.defCheckbox').length > 0) {
                $(this).find('input.defCheckbox').prop('checked', true).addClass('checked');
                $(this).find('div.defCheckbox').addClass('checked');
                //$(this).find('input.defCheckbox').change();
            }

            $(this).next().slideDown(100);
        }

        $(this).toggleClass("twist-down");
        if ($(this).hasClass("defRounded")) {
            $(this).removeClass("defRounded").addClass("defRoundedTop");
            $(this).find(".defCheckbox").removeClass("defRoundedLeft").addClass("defRoundedTopLeft").each(function () {
                $(this).find(".defCheckboxChecked").show();
                $(this).find("input").attr("checked", true);
            });
        } else {
            $(this).removeClass("defRoundedTop").addClass("defRounded");
            $(this).find(".defCheckbox").removeClass("defRoundedTopLeft").addClass("defRoundedLeft").each(function () {
                $(this).find(".defCheckboxChecked").hide();
                $(this).find("input").removeAttr("checked", false);
            });
        }
    });

    if ($('select.allowaddsender').length) {
        $('select.allowaddsender').each(function () {
            var addSenderOption = '<option value="Add Sender">-- Request Sender Name --</option>';

            $(this).append(addSenderOption);

            $(this).change(function () {
                if ($(this).val() == 'Add Sender') {
                    createNewSenderName($(this));
                }
            });
        });
    }

    if ($('select.allowaddgroup').length) {
        $('select.allowaddgroup').each(function () {
            if ($(this).children('option').length == 0) {
                $(this).append('<option value="">-- Select Group --</option>');
            }

            var addSenderOption = '<option value="Add Group">-- Add Group --</option>';

            $(this).append(addSenderOption);

            $(this).change(function () {
                if ($(this).val() == 'Add Group') {
                    createNewGroup($(this));
                }
            });
        });
    }

    if ($('.buycreditsmodal').length) {
        $('.buycreditsmodal').each(function () {
            $(this).click(function () {

                $('body').append($('<div id="modalbg"></div>'));
                $('body').append('<div id="modalbox"><span class="closemodal">&#xf00d;</span><div id="modalinner"></div></div>');

                var opts = {
                    lines: 11, // The number of lines to draw
                    length: 0, // The length of each line
                    width: 9, // The line thickness
                    radius: 41, // The radius of the inner circle
                    color: '#317BBC', // #rgb or #rrggbb or array of colors
                    speed: 1.5, // Rounds per second
                    trail: 100, // Afterglow percentage
                    shadow: false, // Whether to render a shadow
                    hwaccel: false, // Whether to use hardware acceleration
                    className: 'spinner', // The CSS class to assign to the spinner
                    zIndex: 2e9, // The z-index (defaults to 2000000000)
                    top: '50%', // Top position relative to parent
                    left: '50%' // Left position relative to parent
                };

                var modalBoxSpinner = document.getElementById('modalbg');
                var spinner = new Spinner(opts).spin(modalBoxSpinner);

                var reseller = $(this).find('a').attr('href').replace("#buycredits-", "");

                $('#modalinner').load('/ajax/buy-credits.php', {
                    'reseller': reseller
                }, function () {
                    $("#modalbg").html("");
                });

                $('#modalbg').click(function () {
                    if ($('select.allowaddsender').val() == 'Add Sender')
                        $('select.allowaddsender option:first').attr('selected', 'selected');
                    removeModal();
                });

                $('.closemodal').click(function () {
                    if ($('select.allowaddsender').val() == 'Add Sender')
                        $('select.allowaddsender option:first').attr('selected', 'selected');
                    removeModal();
                });

                return false;
            });
        });
    }

    if ($('.loadmodal').length) {
        $('.loadmodal').each(function () {
            $(this).click(function (ev) {
                ev.preventDefault();

                urlToLoad = $(this).attr('href');
                loadModal(urlToLoad);
            });
        });
    }

    $('.defSelect, .defMultiSelect').each(function () {
        buildSelectBox($(this));
    });

    $('.selectBox, .selectMultiBox,.selectBox ul.selectOptions li').live('click', function () {
        if (!$(this).hasClass('disabled')) {
            $('.selectOptions').each(function () {
                if ($(this).is(':visible')) {
                    $(this).fadeOut(100);
                }
            });

            if ($(this).children('.selectOptions').is(':visible')) {
                selectOpen = false;
                $(this).children('.selectOptions').fadeOut(100);
            } else {
                selectOpen = $(this).parent();
                $(this).children('.selectOptions').fadeIn(100);
            }
        }
    });

    $('select.defSelect').live('change', function () {
        $(this).siblings("div.selectBox").find("span").text($(this).find("option:selected").text());
        $(this).siblings("div.selectBox").find("ul li.selected").removeClass("selected");
        $(this).siblings("div.selectBox").find("ul li[id='" + $(this).find('option:selected').val() + "']").addClass("selected");
    });

    $('.inputIcon.select').live('click', function () {
        if (!$(this).siblings('.selectBox').hasClass('disabled')) {
            $('.selectOptions').each(function () {
                if ($(this).is(':visible')) {
                    $(this).fadeOut(100);
                }
            });

            if ($(this).siblings('.selectBox, .selectMultiBox').children('.selectOptions').is(':visible')) {
                selectOpen = false;
                $(this).siblings('.selectBox, .selectMultiBox').children('.selectOptions').fadeOut(100);
            } else {
                selectOpen = $(this).parent();
                $(this).siblings('.selectBox, .selectMultiBox').children('.selectOptions').fadeIn(100);
            }
        }
    });

    $('.inputIcon').live('click', function () {
        if ($(this).siblings('.defInputText').length == 1 && ($(this).siblings('.defInputText').attr('disabled') == false || $(this).siblings('.defInputText').attr('disabled') == undefined)) {
            $(this).siblings('.defInputText').focus();
        }
    });

    $('.selectBox .selectOptions li').live('click', function (event) {
        if ($(this).hasClass('optgroup') == false && $(this).hasClass('disabled') == false) {
            $(this).siblings('.selected').removeClass('selected');
            $(this).addClass('selected');

            $(this).parent().siblings('span').html($(this).html());

            $(this).parent().parent().siblings('select').find('option:selected').removeAttr('selected');
            $(this).parent().parent().siblings('select').find('option[value="' + $(this).attr('id') + '"]').attr('selected', 'selected');
            $(this).parent().parent().siblings('select').change();
        } else
            event.stopPropagation();
    });

    $('.selectMultiBox .selectOptions li').live('click', function (event) {
        if ($(this).hasClass('optgroup') == false && $(this).hasClass('disabled') == false) {
            if ($(this).hasClass('selected')) {
                $(this).removeClass('selected');
                $(this).parent().siblings('span').html($(this).parent().parent().children('span').html().replace(', ' + $(this).html(), ''));

                selectedCount = $(this).parentsUntil($('.selectMultiBox')).find('.selected').length - 1;
                if (selectedCount == 1)
                    $(this).parent().parent().children('span').html($(this).parentsUntil($('.selectMultiBox')).find('.selected').html() + ' and ' + selectedCount + ' other');
                else if (selectedCount == 0)
                    $(this).parent().parent().children('span').html($(this).parentsUntil($('.selectMultiBox')).find('.selected').html());
                else if (selectedCount < 0)
                    $(this).parent().parent().children('span').html('Please select...');
                else
                    $(this).parent().parent().children('span').html($(this).parentsUntil($('.selectMultiBox')).find('.selected').html() + ' and ' + selectedCount + ' others');

                $(this).parent().parent().siblings('select').find('option[value="' + $(this).attr('id') + '"]').removeAttr('selected');
            } else {
                $(this).addClass('selected');

                selectedCount = $(this).parentsUntil($('.selectMultiBox')).find('.selected').length - 1;
                if (selectedCount == 1)
                    $(this).parent().parent().children('span').html($(this).html() + ' and ' + selectedCount + ' other');
                else if (selectedCount == 0)
                    $(this).parent().parent().children('span').html($(this).html());
                else if (selectedCount < 0)
                    $(this).parent().parent().children('span').html('Please select...');
                else
                    $(this).parent().parent().children('span').html($(this).html() + ' and ' + selectedCount + ' others');

                $(this).parent().parent().siblings('select').find('option[value="' + $(this).attr('id') + '"]').attr('selected', 'selected');
            }

            $(this).parent().parent().siblings('select').change();
        }
        event.stopPropagation();
    });

    initCheckboxes();
    $('div.defCheckbox').live('click', function (e) {
        if ($(this).hasClass('disabled') == false) {
            $(this).siblings('input').trigger("changeCheckboxFirst");
        }

    });

    $('input.defCheckbox').live('changeCheckboxFirst', function (e) {
        if ($(this).is(':checked')) {
            $(this).attr('checked', false);
            $(this).closest('table').find("input[type=checkbox][id^=globalcheck]").attr('checked', false);
            $(this).closest('table').find("div[id^=globalcheck]").removeClass('checked');
            $(this).siblings('div').removeClass('checked');
            $(this).change();
        } else {
            $(this).attr('checked', true);
            if ($(this).closest('table').find('tbody input[type=checkbox]').not(':checked').length == 0) {
                $(this).closest('table').find("input[type=checkbox][id^=globalcheck]").attr('checked', true);
                $(this).closest('table').find("div[id^=globalcheck]").addClass('checked');
            }

            $(this).siblings('div').addClass('checked');
            $(this).change();
        }

        if ($('#groupcontacts tbody input.defCheckbox:checked').length > 0) { //More than one checkbox
            $('#moveselected, #copyselected, #optoutselected, #deleteselected, #deleteSelected').removeClass("disabled").attr("disabled", false).parent().removeClass("disabled");
        } else { //Nothing is checked
            $("#moveselected, #copyselected, #optoutselected, #deleteselected, #deleteSelected").prop('disabled', true).addClass('disabled').parent().addClass('disabled');
        }
    });


    $("#recepientlist table.recepientmemberlist div.defCheckbox").live("click", function () {

        id = $('#recepientlist input.recepientradio:checked').attr("id");


        $.post("/content/send-getorigin.php", {
            id: id
        }, function (data) {
            if (data != "") {
                if (data == "xreplyx") {
                    $('input#message-from-reply1').siblings(".defRadio").trigger("click");
                } else {
                    $('input#message-from-reply2').siblings(".defRadio").trigger("click");

                    $('select#message-from option').each(function () {
                        if ($(this).attr("value") != data) {
                            $(this).attr("selected", false);
                        } else {
                            $(this).attr("selected", true);
                        }
                    });

                    //if no sendernames, dont trigger adding one
                    if ($('select#message-from').val() != "Add Sender") {
                        $('select#message-from').change();
                    }
                }
                updateSendernameStatus();
            }
        });
    });

    initRadios();
    $('div.defRadio').live('click', function () {
        if ($(this).hasClass('disabled') == false) {
            if (!$(this).hasClass('checked')) {

                radioName = $(this).siblings("input").attr('name');

                $('input[name="' + radioName + '"]:checked').each(function () {
                    $(this).removeClass("checked");
                    $(this).attr('checked', false).change();
                    $(this).siblings(".defRadio").removeClass('checked');
                });

                $(this).addClass('checked');
                $(this).siblings("input").attr('checked', true).change();

            }
        }
    });

    $('.defLabel').live('click', function () {
        forAttr = $(this).attr('for');

        if (forAttr !== undefined && forAttr !== false && forAttr != '') {
            $('#' + forAttr).trigger("click");
        }
    });

    $('.showHelp').live('click', function () {
        helpID = $(this).attr('data-helpid');
        helpPopOver = $('.helpPopOver[data-helpid="' + helpID + '"]');

        showHelp = $(this);
        showHelpPos = showHelp.position();
        helpPopOver.css('top', showHelpPos.top - 25);
        helpPopOver.css('left', showHelpPos.left - (helpPopOver.width() + 10));

        if ($(this).closest("#stModalContent").length > 0) {
            helpPopOver.find(".helpContent").css({'max-height': $(this).closest("#stModalContent").height() - 40, 'overflow': 'auto'});
        }

        if (helpPopOver.is(':visible')) {
            helpPopOver.fadeOut(100);
            $(this).html("&#xf128;").removeClass("close");

            $("body").unbind("click");
        } else {
            helpPopOver.fadeIn(100);
            $(this).html("&#xf00d;").addClass("close");

            $('body').click(function (event) {
                if (!$(event.target).closest('.helpContainer').length) {
                    helpPopOver.fadeOut(100);
                    showHelp.html("&#xf128;").removeClass("close");

                    $("body").unbind("click");
                }
                ;
            });
        }
    });

    $('.helpPopOver .helpButton.next').live("click", function () {
        selectBoxChange($(this).parent().find("select"), $(this).parent().find("select option:selected").next().val());
    });

    $('.helpPopOver .helpButton.back').live("click", function () {
        selectBoxChange($(this).parent().find("select"), $(this).parent().find("select option:selected").prev().val());
    });

    $('.helpPopOver select').live("change", function () {
        updateHelpPopOver($(this).val(), $(this).parent().parent().parent());
    });


    //NOT TO SELF
    //TURN ALL OF THE ABOVE IFS INTO A FUNCTION THAT CHECKS THE STATUS 

    loadMergeToolTips();

    $("#mergeFieldButtons #leftMergeButtons .defButton").live("mouseenter", function () {
        var itemHover = $(this);
        var t = setTimeout(function () {
            itemHover.find(".toolTip").fadeIn(200);
        }, 750);
        itemHover.data('timeout', t);
    });

    $("#mergeFieldButtons #leftMergeButtons .defButton").live("mouseleave", function () {
        clearTimeout($(this).data('timeout'));
        $(this).find(".toolTip").fadeOut(200);
    });
    loadHelpBoxes();

    $('#show-keyboard-reference').on('click', function () {
        if (!$(this).hasClass('disabled')) {
            $(this).addClass('disabled');

            displayKeyboardReference($('#drpLanguage option:selected').text());
        }
    });

    $('body').on('click', '.closeKeyboardRef', function () {
        $('#show-keyboard-reference').removeClass('disabled');

        hideKeyboardReference();
    });
});

function loadHelpBoxes() {
    $('.showHelp').each(function () {
        if (!$(this).hasClass('initd')) {
            $(this).addClass('initd');
            helpID = $(this).attr('data-helpid');
            showHelpPos = $(this).position();
            helpPopOver = $('.helpPopOver[data-helpid="' + helpID + '"]');
            helpPopOver.css('top', showHelpPos.top - 25);
            helpPopOver.css('left', showHelpPos.left - (helpPopOver.width() + 10));
            buildSelectBox(helpPopOver.find("select"));
            if ($(this).closest('#modalbox').length > 0 && $(this).siblings().length == 0) {
                $(this).parent('h2').css('height', '20px');
            }
            //console.log($(this));
            //  updateHelpPopOver(helpID, $('.helpPopOver').parent());
        }
    });
}

function loadMergeToolTips() {
    $("#mergeFieldButtons #leftMergeButtons .defButton").each(function () {
        if (!$(this).hasClass("tooltiped")) {
            $(this).append("<div class='toolTip'>" + $(this).attr("title") + "</div>").removeAttr("title");
            var butWidth = $(this).outerWidth() / 2;
            var toolWidth = $(this).find(".toolTip").outerWidth() / 2;
            var moveDist = toolWidth - butWidth;
            $(this).find(".toolTip").css("left", "-" + moveDist + "px");
            $(this).addClass("tooltiped");
        }
    });
}

function initTwisties() {
    $('div.twisties .twistieHeader').addClass("twist");
    $('div.twisties .twistcontent').each(function (element) {
        if ($(this).hasClass("expanded")) {
            $(this).siblings('.twistieHeader').addClass("twist-down");
            $(this).siblings('.twistieHeader').find('.leftToggleArrow').html('&#xf106;');
            $(this).siblings('.twistieHeader').find('.rightToggleArrow').html('&#xf106;');

            if ($(this).siblings('.twistieHeader').find('.defCheckbox').length > 0) {
                $(this).siblings('.twistieHeader').find('input.defCheckbox').prop('checked', true).addClass('checked');
                $(this).siblings('.twistieHeader').find('div.defCheckbox').addClass('checked');
            }
        } else {
            $(this).siblings('.twistieHeader').find('.leftToggleArrow').html('&#xf107;');
            $(this).siblings('.twistieHeader').find('.rightToggleArrow').html('&#xf107;');
            if ($(this).siblings('.twistieHeader').find('.defCheckbox').length > 0) {
                $(this).siblings('.twistieHeader').find('input.defCheckbox').prop('checked', false).removeClass('checked');
                $(this).siblings('.twistieHeader').find('div.defCheckbox').removeClass('checked');
            }
            $(this).hide();
        }
    });
}

function initRadios() {
    $('.defRadio').each(function () {
        if (!$(this).hasClass("initd")) {
            $(this).addClass("initd");
            radioClasses = '';
            if (typeof $(this).attr('class') !== typeof undefined && $(this).attr('class') !== false)
                radioClasses = $(this).attr('class');
            if ((typeof $(this).attr('checked') !== typeof undefined && $(this).attr('checked') !== false) && (radioClasses !== typeof undefined))
                radioClasses += " checked";
            else if (typeof $(this).attr('checked') !== typeof undefined && $(this).attr('checked') !== false)
                radioClasses += "checked";

            if (typeof $(this).attr('disabled') !== typeof undefined && $(this).attr('disabled') !== false) {
                if (radioClasses == '')
                    radioClasses += 'disabled';
                else
                    radioClasses += ' disabled';
            }

            radioIDs = '';
            if (typeof $(this).attr('id') !== typeof undefined && $(this).attr('id') !== false)
                radioIDs = $(this).attr('id');

            if ($(this).parent().find("input, submit, textarea, select, div.inlineGutter").length == 1 && $(this).parent().find("label").length == 1) {
                $(this).parent().prepend('<div class="' + radioClasses + ' inlineLabel" id="' + radioIDs + '"><span>&#xf00c;</span></div>');
            } else {
                $(this).before('<div class="' + radioClasses + '" id="' + radioIDs + '"><span></span></div>');
            }

        }
    });
}

function initCheckboxes() {
    $('.defCheckbox').each(function () {
        if (!$(this).hasClass("initd")) {
            $(this).addClass("initd");
            checkClasses = '';
            if (typeof $(this).attr('class') !== typeof undefined && $(this).attr('class') !== false)
                checkClasses = $(this).attr('class');
            if ((typeof $(this).attr('checked') !== typeof undefined && $(this).attr('checked') !== false) && (checkClasses !== typeof undefined))
                checkClasses += " checked";
            else if (typeof $(this).attr('checked') !== typeof undefined && $(this).attr('checked') !== false)
                checkClasses += "checked";

            if (typeof $(this).attr('disabled') !== typeof undefined && $(this).attr('disabled') !== false) {
                if (checkClasses == '')
                    checkClasses += 'disabled';
                else
                    checkClasses += ' disabled';
            }

            checkboxIDs = '';
            if (typeof $(this).attr('id') !== typeof undefined && $(this).attr('id') !== false)
                checkboxIDs = $(this).attr('id');

            if ($(this).parent().find("input, submit, textarea, select, div.inlineGutter").length == 1 && $(this).parent().find("label").length == 1) {
                $(this).parent().prepend('<div class="' + checkClasses + ' inlineLabel" id="' + checkboxIDs + '"><span>&#xf00c;</span></div>');
            } else {
                $(this).before('<div class="' + checkClasses + '" id="' + checkboxIDs + '"><span>&#xf00c;</span></div>');
            }
        }
    });
}


function buildSelectBox(selector) {
    selectOptionsContent = '';
    selectedValue = '';
    selectedCount = 0;

    if (typeof selector.attr('disabled') !== typeof undefined && selector.attr('disabled') !== false) {
        selectedDisabled = true;
    } else {
        selectedDisabled = false;
    }

    if (selector.attr("multiple") != undefined) {
        selectType = 'selectMultiBox';
    } else {
        selectType = 'selectBox';
    }

    if (selector.attr('class') !== typeof undefined && selector.attr('class') !== false) {
        selectClasses = ' ' + selector.attr('class');
    }

    if (selectedDisabled) {
        selectClasses += ' disabled';
    }

    if (selector.attr('style') !== typeof undefined && selector.attr('style') !== false) {
        selectStyles = selector.attr('style');
    } else {
        selectStyles = "";
    }

    selector.find('option, optgroup').each(function () {
        value = $(this).val();
        valueText = $(this).html();
        valueLabel = $(this).attr('label');
        valueDisabled = $(this).attr('disabled');
        isOptGroup = false;
        isSubOptGroup = false;
        isSelected = false;

        if ($(this)[0].tagName == 'OPTGROUP') {
            isOptGroup = true;
        } else if ($(this).parent()[0].tagName == 'OPTGROUP') {
            isSubOptGroup = true;
        }

        if ($(this).attr('selected') !== undefined) {
            isSelected = true;
            selectedCount++;
            selectedValue = valueText;
        }

        selectOptionsContent += '<li id="' + value + '"';

        if (isOptGroup || isSubOptGroup || isSelected || valueDisabled) {
            selectOptionsContent += ' class="';
        }

        if (isOptGroup) {
            selectOptionsContent += 'optgroup';
        } else if (isSubOptGroup) {
            selectOptionsContent += 'optgroupSub';
        }

        if ((isOptGroup || isSubOptGroup) && isSelected) {
            selectOptionsContent += ' selected';
        } else if (isSelected) {
            selectOptionsContent += 'selected';
        }

        if ((isOptGroup || isSubOptGroup || isSelected) && valueDisabled) {
            selectOptionsContent += ' disabled';
        } else if (valueDisabled) {
            selectOptionsContent += 'disabled';
        }

        if (isOptGroup || isSubOptGroup || isSelected || valueDisabled) {
            selectOptionsContent += '"';
        }

        if (valueLabel) {
            selectOptionsContent += '>' + valueLabel + '</li>';
        } else {
            selectOptionsContent += '>' + valueText + '</li>';
        }
    });

    selector.parent().find("." + selectType).remove();
    selector.parent().find(".inputIcon").remove();

    selector.after('<div class="' + selectType + selectClasses + '" style="' + selectStyles + '"><span>' + selectedValue + '</span><ul class="selectOptions">' + selectOptionsContent + '</ul></div><div class="inputIcon select">&#xf107;</div>');

    selectedCount--;
    if (selectedCount === 1 && selectType == 'selectMultiBox')
        selector.siblings('.selectMultiBox').children('span').html(selector.siblings('.selectMultiBox').children('span').html() + ' and ' + selectedCount + ' other');
    if (selectedCount > 1 && selectType == 'selectMultiBox')
        selector.siblings('.selectMultiBox').children('span').html(selector.siblings('.selectMultiBox').children('span').html() + ' and ' + selectedCount + ' others');
}

function updateHelpPopOver(helpID, selector) {
//console.log(selector);

    //get the index of the currently selected option in this help object
    var currentSelectedOption = selector.find("select option:selected");
    var optionsAvailable = selector.find("select option").length;
    //console.log(currentSelectedOption.index() + 1);
    //console.log(optionsAvailable);
    //if the option after the currently selected option is the last
    if ((currentSelectedOption.index() + 1) >= optionsAvailable) {
        //hide the next button
        selector.find(".helpButton.next").addClass("hide");
    } else if ((currentSelectedOption.index() == 0) && optionsAvailable > 1) {
        //show the next button
        selector.find(".helpButton.next").removeClass("hide");
    } else {
        //show the next button
        selector.find(".helpButton.next").removeClass("hide");
    }

    //if the option before before the currently selected option is the first
    if (currentSelectedOption.index() <= 1) {
        //hide the back button
        selector.find(".helpButton.back").addClass("hide");
    } else {
        //show the back button
        selector.find(".helpButton.back").removeClass("hide");
    }


    selector.find(".helpContent").html("<h3>" + window["helpContent_" + selector.attr("data-helpid")][helpID]["title"] + "</h3>" + window["helpContent_" + selector.attr("data-helpid")][helpID]["HTML"]);
}

function selectBoxChange(selector, value, runChange) {
    if (selector.attr("multiple") == undefined) {
        selector.find("option").each(function () {
            $(this).attr("selected", false);
        });
    }

    selector.find("option[value='" + value + "']").attr("selected", "selected");

    if (runChange === undefined) {
        selector.change();
    }

    buildSelectBox(selector);
}

/*
 $(document).click (function (e) {
 if (selectOpen != false && (e.target != selectOpen.find(".selectBox")[0] && e.target != selectOpen.find(".select")[0])){
 selectOpen.find(".selectOptions")[0].fadeOut(100);
 }
 });
 */

$(document).mouseup(function (e) {
    if (selectOpen != false && (!$(selectOpen[0]).is(e.target) && $(selectOpen[0]).has(e.target).length === 0) && (e.target != $('html').get(0))) {
        $(selectOpen[0]).find(".selectOptions").fadeOut(100);
    }
});



function changeSendTabs(newtab, newcontent, oldcontent) {
    if (newtab != undefined && newcontent != undefined && oldcontent != undefined) {
        $(oldcontent).empty();
        $(newcontent).html("<span class=\"loading\"><span>Loading...</span></span>");
        var url = "/content/" + $(newtab).attr("href").replace("#", "") + ".php";
        url = url + "?customerID=" + $(newtab).attr("rel");
        $.ajaxSetup({async: false});
        $.get(url, function (data) {
            $(newcontent).html(data);
            if ($('#contactsform').length) {
                var title = $(newtab).attr("href").substring(10);
                var titleA = title.substring(0, 1).toUpperCase();
                var titleB = title.substring(1);
                $('#messagedetails h3').text(titleA + titleB + " Manager");
            }
            initrecepientlist();
        });
        $.ajaxSetup({async: true});
        return true;
    }
    return true;
}

function checkPermission() {
    try {
        if (window.webkitNotifications.checkPermission() > 0) {
            window.webkitNotifications.requestPermission();
        }
    } catch (e) {
        //meh.
    }
}

function displayNotifications()
{
    try {
        if (window.webkitNotifications) {

            var thumb = 'http://www.textlocal.com/img/logo.png';
            var title = 'New Message Received';
            var body = 'New Message Received! Click here to view inboxes!';

            var popup = window.webkitNotifications.createNotification(thumb, title, body);

            //Show the popup
            popup.show();

            popup.onclick = function () {
                window.open("https://control.textlocal.in/messages");
                popup.cancel();
            }

            //set timeout to hide it
            setTimeout(function () {
                popup.cancel();
            }, '15000');
        }
    } catch (e) {
        //shhhh
    }
}

function closeInjectBoxes() {
    $(".customInsertBox").each(function () {
        $(this).fadeOut();
    });
}

function removeDropdown() {
    if (navigator.userAgent.match(/(iPad)|(iPhone)|(iPod)|(android)|(webOS)/i)) {
        $("ul#new-navigation li").each(function () {
            $(this).removeClass("subhover");
        });
        $("ul#new-navigation li").find("ul.subnav").slideUp('fast');
    }
}

function removeImportDupes(event) {
    var changed = "";
    var headers = new Array();
    var i = 0;

    $('#importcolumnheader th select').each(function () {
        headers[i] = $(this).val();
        i++;
    });

    dupe = arrHasDupes(headers);

    if (dupe) {
        headers.reverse();
        lim = headers.length;

        if (event) {
            var changed = (event.target.id);
            if (changed.length > 4) {
                var chars = 2;
            } else {
                var chars = 1;
            }
            var changed = lim - changed.substr(3, chars) * 1 - 1;
        }

        for (i = 0; i <= lim; i++) {
            if (headers[i] == dupe) {
                if (changed == i) {
                    continue;
                }
                headers[i] = "X";
                i = lim;
            }
        }
        headers.reverse();
        var i = 0;

        $('#importcolumnheader th select').each(function () {
            selectBoxChange($(this), headers[i], false);
            i++;
        });
    }
}

function getHelpPage(categoryName, forward) {

    if (forward == true) {
        var newReturnLink = $("#helpBackButton").attr("custominfo") + "/" + categoryName;
        $("#helpBackButton").attr("custominfo", newReturnLink);
    } else {
        var backPage = $("#helpBackButton").attr("custominfo").split('/');

        var arrLen = backPage.length;
        var catPos = arrLen - 2;

        categoryName = backPage[catPos];

        delete backPage[arrLen - 1];

        var customInfo = "";
        var first = true;
        for (var i in backPage) {
            if (first) {
                customInfo = customInfo + backPage[i];
                first = false;
            } else {
                customInfo = customInfo + "/" + backPage[i];
            }
        }

        $("#helpBackButton").attr("custominfo", customInfo);

    }

    $.ajax({
        url: "/ajax/help-getContent.php",
        data: "category=" + encodeURI(categoryName),
        success: function (resp) {
            if (forward == true || (backPage.length - 1) > 1) {
                $("#helpButton").show();
            } else {
                $("#helpButton").hide();
            }

            var myObject = eval('(' + resp + ')');
            $("#helpTitle").html(myObject["title"]);
            $("#helpContent").html(myObject["content"]);
            $(".helpBox").find("*").each(function () {
                //ADDS PASS THROUGH CLASS TO ALL CHILDREN to stop helpboc close...
                //$(this).addClass("hrPass");
                $(this).attr("hrpass", "true");
            });
        }
    });
}

function arrHasDupes(A) { // finds any duplicate array elements using the fewest possible comparison
    var i, j, n;
    n = A.length; // to ensure the fewest possible comparisons
    for (i = 0; i < n; i++) { // outer loop uses each item i at 0 through n
        for (j = i + 1; j < n; j++) { // inner loop only compares items j at i+1 to n
            if (A[j] == "X")
                continue; // ignore "X" as an option
            if (A[i] == A[j])
                return (A[j]); // hit
        }
    }
    return false; // not hit
}

var isUnicode = false;

function countChars() {

    wappushurl = false;
    wappushmode = false;
    testUnicode();
    if (!isUnicode) {
        msgLength = 160;
        msgLongLength = 153;

        //replace Unicode replacement character

        //This requires fixing - the string replace doesn't work on anything IE related - must be fixed.

        /*var sBrowser, sUsrAg = navigator.userAgent;
         if (sUsrAg.indexOf("MSIE 8.0")>-1 || sUsrAg.indexOf("MSIE 7.0")>-1 || sUsrAg.indexOf("MSIE 6.0")>-1) {
         //do nothing
         } else {
         $("#message-body").val($("#message-body").val().replace('\uFFFD',''));
         }*/

    } else {
        msgLength = 70;
        msgLongLength = 67;
    }

    if ($('#autoresponseurl').length) {
        if ($('#autoresponseurl').attr("checked") == true) {
            wappushurl = $("#message-wapurl").val().length;
            wappushmode = true;
        }
    }
    if ($('#message-wapurl-toggle').length) {
        if ($('#message-wapurl-toggle').attr("checked") == true) {
            wappushurl = $("#message-wapurl").val().length;
            wappushmode = true;
        }
    }

    if (!wappushurl) {
        wappushurl = 0;
    }

    extrachars = wappushurl;
    addonchars = 0;
    merged = false;
    messageStr = "";

    if (typeof trackingchars === 'undefined')
        trackingchars = 11;
    for (i = 0; i < countInstances("#message-body", "#FirstName#"); i++) {
        extrachars = extrachars - 11 + firstnamechars;
        merged = true
    }

    for (i = 0; i < countInstances("#message-body", "#LastName#"); i++) {
        extrachars = extrachars - 10 + lastnamechars;
        merged = true
    }

    for (i = 0; i < countInstances("#message-body", "#Custom1#"); i++) {
        extrachars = extrachars - 9 + custom1chars;
        merged = true
    }

    for (i = 0; i < countInstances("#message-body", "#Custom2#"); i++) {
        extrachars = extrachars - 9 + custom2chars;
        merged = true
    }

    for (i = 0; i < countInstances("#message-body", "#Custom3#"); i++) {
        extrachars = extrachars - 9 + custom3chars;
        merged = true
    }

    for (i = 0; i < countInstances("#message-body", "#PageTrack#"); i++) {
        extrachars = extrachars - 11 + trackingchars;
        merged = true
    }
    for (i = 0; i < countInstances("#message-body", "#LinkTrack#"); i++) {
        extrachars = extrachars - 11 + trackingchars;
        merged = true
    }
    for (i = 0; i < countInstances("#message-body", "#TicketCode#"); i++) {
        extrachars = extrachars - 11 + trackingchars;
        merged = true
    }
    for (i = 0; i < countInstances("#message-body", "#AdvdTrack#"); i++) {
        extrachars = extrachars + 2;
        merged = true
    }

    if ($("#message-body").val().indexOf("%%") > -1) {

        var messageComponents = $("#message-body").val().split('%%');

        for (var i = 0; i < messageComponents.length; i++) {

            if (messageComponents[i].charAt(0) == "|") {

                //remove the %% from eahch end
                extrachars = extrachars - 4;
                //remove the |
                extrachars = extrachars - 1;

                //check for options
                if (messageComponents[i].indexOf("^") > -1) {

                    var msgComponents = messageComponents[i].split("^");

                    //remove the ^
                    extrachars = extrachars - 1;

                    //remove the entire json string
                    extrachars = extrachars - msgComponents[1].length;
                    try {
                        var msgOptions = jQuery.parseJSON(msgComponents[1]);

                        if (msgOptions.options != undefined) {
                            //Its a dropdown
                            var longestOption = 0;

                            for (var j = 0; j < msgOptions.options.length; j++) {
                                if (msgOptions.options[j].length > longestOption) {
                                    longestOption = msgOptions.options[j].length;
                                }
                            }
                            //add the longest option
                            extrachars = extrachars + longestOption;
                            //remove the title because it's not displayed in the message
                            var startPos = messageComponents[i].indexOf("|") + 1;
                            var endPos = messageComponents[i].indexOf("^", startPos - 1);
                            var textLength = messageComponents[i].substring(startPos, endPos).length;
                            extrachars = extrachars - textLength;

                        } else if (msgOptions.maxlength != undefined) {
                            extrachars = extrachars + parseInt(msgOptions.maxlength.replace(/\D/g, ''));

                            //remove any count of the placeholder cause we've got a max length instead.
                            var startPos = messageComponents[i].indexOf("|") + 1;
                            var endPos = messageComponents[i].indexOf("^", startPos - 1);
                            var textLength = messageComponents[i].substring(startPos, endPos).length;
                            extrachars = extrachars - textLength;

                        }
                        else {
                            //count the placeholder only
                            extrachars = extrachars + messageComponents[0].replace('|', "").length;
                        }
                    } catch (err) {
                    }
                } else {
                    //count the placeholder only
                    extrachars = extrachars + messageComponents[i].replace('|', "").length;
                }
            } else {
                //normal text
            }
        }
    }


    if (merged) {
        messageStr = "<br />This is only a guide, as merged fields may vary in length.";
    }

    var form = $("#message-body").closest("form").get();

    if (isUnicode) {
        form.acceptCharset = "UTF-8";
        $('#sendSpecialMessage').html("<div id=\"\" class=\"defNotice warning \"><div class=\"icon\">&#xf071;</div><div class=\"noticeContent\">This message will be sent as a Unicode message.</div></div><br />");
    } else {
        form.acceptCharset = "";
        $('#sendSpecialMessage').html("");
    }

    //add an extra char for all euro symbols
    extrachars = extrachars + $("#message-body").val().countOddChars(String.fromCharCode(8364));

    if ($("#message-body").val().indexOf(String.fromCharCode(8220)) != -1 ||
            $("#message-body").val().indexOf(String.fromCharCode(8221)) != -1 ||
            $("#message-body").val().indexOf(String.fromCharCode(8216)) != -1 ||
            $("#message-body").val().indexOf(String.fromCharCode(8217)) != -1) {
        $("#message-body").val($("#message-body").val().replace(String.fromCharCode(8220), '"'));
        $("#message-body").val($("#message-body").val().replace(String.fromCharCode(8221), '"'));
        $("#message-body").val($("#message-body").val().replace(String.fromCharCode(8216), "'"));
        $("#message-body").val($("#message-body").val().replace(String.fromCharCode(8217), "'"));
    }
    //addonchars = $("#message-addon").val().length;
    if ($('#message-addon').length) {
        //if ($("#message-body:contains('" + $("#message-addon").val() + "')")) {
        var str = $("#message-body").val();
        if (str.indexOf($('#message-addon').val()) != -1) {
            addonchars = 0;
        } else {
            addonchars = $("#message-addon").val().length;
        }
    }
    var trimmedmessage = $.trim($("#message-body").val());
    var chars = trimmedmessage.length + extrachars + addonchars;
    if (maxchars == undefined)
        maxchars = msgLongLength * 5;
    var charsleft = maxchars - chars;
    //	if (charsleft<0) {charsleft=0;}
    $('#remainingcharacters').text(chars);

    if (chars > "114" && wappushmode == true) {
        $('#remainingchars').removeClass("stageone").removeClass("stagetwo").removeClass("stagethree").removeClass("stagefour").addClass("stagefive");
        $('#message-body').val($('#message-body').val().substr(0, $("#message-body").val().length - 1));
        countChars();
    }

    if (maxchars == "140" && chars > "140") {
        $('#message-body').val($('#message-body').val().substr(0, $("#message-body").val().length - 1));
        $('#totalmessages').html("");
        countChars();
        return;
    }

    if (maxchars == "160" && chars > "160") {
        $('#message-body').val($('#message-body').val().substr(0, $("#message-body").val().length - 1));
        $('#totalmessages').html("");
        countChars();
        return;
    }

    if (chars < msgLength + 1) {
        $('#remainingchars').addClass("stageone").removeClass("stagetwo").removeClass("stagethree").removeClass("stagefour").removeClass("stagefive");
        $('#totalmessages').html("");
    }
    if (chars > msgLength) {
        $('#remainingchars').removeClass("stageone").addClass("stagetwo").removeClass("stagethree").removeClass("stagefour").removeClass("stagefive");
        $('#totalmessages').html("<br />Messages over 160 characters will be sent as <strong>2</strong> texts." + messageStr);
        if (isUnicode) {
            $('#totalmessages').html($('#totalmessages').html().replace('160', '70'));
        }
    }

    if (chars > msgLongLength * 2) {
        $('#remainingchars').removeClass("stageone").removeClass("stagetwo").addClass("stagethree").removeClass("stagefour").removeClass("stagefive");
        $('#totalmessages').html("<br />Messages over 306 characters will be sent as <strong>3</strong> texts." + messageStr);
        if (isUnicode) {
            $('#totalmessages').html($('#totalmessages').html().replace('306', '134'));
        }
    }

    if (chars > msgLongLength * 3) {
        $('#remainingchars').removeClass("stageone").removeClass("stagetwo").removeClass("stagethree").addClass("stagefour").removeClass("stagefive");
        $('#totalmessages').html("<br />Messages over 459 characters will be sent as <strong>4</strong> texts." + messageStr);
        if (isUnicode) {
            $('#totalmessages').html($('#totalmessages').html().replace('459', '201'));
        }
    }

    if (chars > msgLongLength * 4) {
        $('#remainingchars').removeClass("stageone").removeClass("stagetwo").removeClass("stagethree").removeClass("stagefour").addClass("stagefive");
        $('#totalmessages').html("<br />Messages over 612 characters will be sent as <strong>5</strong> texts." + messageStr);
        if (isUnicode) {
            $('#totalmessages').html($('#totalmessages').html().replace('612', '268'));
        }
    }

    if (chars > msgLongLength * 5) {
        $('#remainingchars').removeClass("stageone").removeClass("stagetwo").removeClass("stagethree").removeClass("stagefour").addClass("stagefive");
        $('#message-body').val($('#message-body').val().substr(0, $("#message-body").val().length - 1));
        countChars();
    }
}
;

function countCharsDown() { //Count the number of chars in the #message-body and handle the count (counts down)
    if ($('#autoresponseurl').length) {
        if ($('#autoresponseurl').attr("checked") == true) {
            wappushurl = $("#message-wapurl").val().length;
        }
    }
    extrachars = wappushurl;
    merged = false;
    message = "";
    for (i = 0; i < countInstances("#message-body", "#FirstName#"); i++) {
        extrachars = extrachars - 11 + firstnamechars;
        merged = true
    }
    for (i = 0; i < countInstances("#message-body", "#LastName#"); i++) {
        extrachars = extrachars - 10 + lastnamechars;
        merged = true
    }
    for (i = 0; i < countInstances("#message-body", "#Custom1#"); i++) {
        extrachars = extrachars - 9 + custom1chars;
        merged = true
    }
    for (i = 0; i < countInstances("#message-body", "#Custom2#"); i++) {
        extrachars = extrachars - 9 + custom2chars;
        merged = true
    }
    for (i = 0; i < countInstances("#message-body", "#Custom3#"); i++) {
        extrachars = extrachars - 9 + custom3chars;
        merged = true
    }
    for (i = 0; i < countInstances("#message-body", "#Custom3#"); i++) {
        extrachars = extrachars - 9 + custom3chars;
        merged = true
    }
    for (i = 0; i < countInstances("#message-body", "#PageTrack#"); i++) {
        extrachars = extrachars - 4;
        merged = true
    }
    for (i = 0; i < countInstances("#message-body", "#TicketCode#"); i++) {
        extrachars = extrachars - 12 + ticketchars;
        merged = true
    }
    for (i = 0; i < countInstances("#message-body", "#LinkTrack#"); i++) {
        extrachars = extrachars - 4;
        merged = true
    }
    for (i = 0; i < countInstances("#message-body", "#AdvdTrack#"); i++) {
        extrachars = extrachars + 2;
        merged = true
    }
    if (merged) {
        message = "<br />This is only a guide, as merged fields may vary in length.";
    }
    var chars = $("#message-body").val().length + extrachars;
    var charsleft = maxchars - chars;
    //	if (charsleft<0) {charsleft=0;}
    $('#remainingcharacters').text(charsleft);
    if (chars < "161") {
        $('#remainingchars').addClass("stageone").removeClass("stagetwo").removeClass("stagethree").removeClass("stagefour").removeClass("stagefive");
        $('#totalmessages').html("");
    }
    if (chars > "160") {
        $('#remainingchars').removeClass("stageone").addClass("stagetwo").removeClass("stagethree").removeClass("stagefour").removeClass("stagefive");
        $('#remainingchars').removeClass().addClass("stagetwo");
        $('#totalmessages').html("<br />This message will be sent as 2 text messages." + message);
    }
    if (chars > "306") {
        $('#remainingchars').removeClass("stageone").removeClass("stagetwo").addClass("stagethree").removeClass("stagefour").removeClass("stagefive");
        $('#totalmessages').html("<br />This message will be sent as 3 text messages." + message);
    }
    if (chars > "459") {
        $('#remainingchars').removeClass("stageone").removeClass("stagetwo").removeClass("stagethree").addClass("stagefour").removeClass("stagefive");
        $('#totalmessages').html("<br />This message will be sent as 4 text messages." + message);
    }
    if (chars == "612") {
        $('#remainingchars').removeClass("stageone").removeClass("stagetwo").removeClass("stagethree").removeClass("stagefour").addClass("stagefive");
        $('#totalmessages').html("<br />This message will be sent as 5 text messages." + message);
    }
    if (chars > "612") {
        $('#remainingchars').removeClass("stageone").removeClass("stagetwo").removeClass("stagethree").removeClass("stagefour").addClass("stagefive");
        $('#message-body').val($('#message-body').val().substr(0, $("#message-body").val().length - 1));
        countChars();
    }
    if (charsleft < 0) {
        $('#message-body').val($('#message-body').val().substr(0, $("#message-body").val().length - 1));
        countChars();
    }
}
;



function updateBalances(repeat, timeout) {

    $.ajax({
        url: '/ajax/balance.php',
        dataType: 'json',
        success: function (resp) {
            var balanceClass;
            if (resp['sms'] != null && resp['sms'] !== undefined) {
                if (resp['sms'] < 51)
                    balanceClass = 'lowcredits';
                else
                    balanceClass = 'highcredits';
                $('#balance-sms').html(resp['sms']).removeClass('lowcredits highcredits').addClass(balanceClass);
            }

            if (resp['mms'] != null && resp['mms'] !== undefined) {
                if (resp['mms'] < 11)
                    balanceClass = 'lowcredits';
                else
                    balanceClass = 'highcredits';
                $('#balance-mms').html(resp['mms']).removeClass('lowcredits highcredits').addClass(balanceClass);
            }

            if (resp['error'] != null && resp['error'] !== undefined && resp['redirect'] == 'true') {
                repeat = false;
                window.location.replace('/?logout=true');
                return;
            }
        }
    });

    if (repeat == true) {
        setTimeout('updateBalances(true, ' + timeout + ')', timeout);
    }
}

function countChars160() { //Count the number of chars in the #message-body and handle the count, limited to only 160 chars with no merged fields



    var chars = $("#message-body-160").val().length;
    var maxchars = 160;
    var charsleft = maxchars - chars;
    if (charsleft < 0) {
        charsleft = 0;
    }
    $('#remainingcharacters').text(charsleft);
    if (chars < "100") {
        $('#remainingchars').addClass("stageone").removeClass("stagetwo").removeClass("stagethree").removeClass("stagefour").removeClass("stagefive");
    }
    if (chars > "0") {
        $('#remainingchars').removeClass("stageone").addClass("stagetwo").removeClass("stagethree").removeClass("stagefour").removeClass("stagefive");
    }
    if (chars > "100") {
        $('#remainingchars').removeClass("stageone").removeClass("stagetwo").addClass("stagethree").removeClass("stagefour").removeClass("stagefive");
    }
    if (chars > "130") {
        $('#remainingchars').removeClass("stageone").removeClass("stagetwo").removeClass("stagethree").addClass("stagefour").removeClass("stagefive");
    }
    if (chars == "160") {
        $('#remainingchars').removeClass("stageone").removeClass("stagetwo").removeClass("stagethree").removeClass("stagefour").addClass("stagefive");
    }
    if (chars > "160") {
        $('#remainingchars').removeClass("stageone").removeClass("stagetwo").removeClass("stagethree").removeClass("stagefour").addClass("stagefive");
        $('#message-body-160').val($('#message-body-160').val().substr(0, $("#message-body-160").val().length - 1));
        countChars160();
    }
}
;

function countCharsMMS() { //Count the number of chars in the #message-body-mms and handle the count, limited to 612 characters
    var chars = $("#message-body").val().length;
    $('#remainingcharacters').text(chars);

    if (chars > "612") {
        $('#message-body').val($('#message-body').val().substr(0, $("#message-body").val().length - 1));
        countCharsMMS();
    }
}
;

function insertAtCaret(obj, string) { //Insert text in the textarea#areaId where the caret is
    obj = document.getElementById(obj);
    obj.focus();
    if (typeof (document.selection) != 'undefined') {
        var range = document.selection.createRange();
        if (range.parentElement() != obj)
            return;
        range.text = string;
        range.select();
    } else if (typeof (obj.selectionStart) != 'undefined') {
        var start = obj.selectionStart;
        obj.value = obj.value.substr(0, start) + string + obj.value.substr(obj.selectionEnd, obj.value.length);
        start += string.length;
        obj.setSelectionRange(start, start);
    } else
        obj.value += string;
    obj.focus();
}

function insertAtCaretOld(areaId, text) {
    var txtarea = document.getElementById(areaId);
    var scrollPos = txtarea.scrollTop;
    var strPos = 0;
    var br = ((txtarea.selectionStart || txtarea.selectionStart == '0') ?
            "ff" : (document.selection ? "ie" : false));
    if (br == "ie") {
        txtarea.focus();
        var range = document.selection.createRange();
        range.moveStart('character', -txtarea.value.length);
        strPos = range.text.length;
    } else if (br == "ff")
        strPos = txtarea.selectionStart;
    var front = (txtarea.value).substring(0, strPos);
    var back = (txtarea.value).substring(strPos, txtarea.value.length);
    txtarea.value = front + text + back;
    strPos = strPos + text.length;
    if (br == "ie") {
        txtarea.focus();
        var range = document.selection.createRange();
        range.moveStart('character', -txtarea.value.length);
        range.moveStart('character', strPos);
        range.moveEnd('character', 0);
        range.select();
    } else if (br == "ff") {
        txtarea.selectionStart = strPos;
        txtarea.selectionEnd = strPos;
        txtarea.focus();
    }
    txtarea.scrollTop = scrollPos;
}

function countInstances(target, string) { //Returns how many 'string's appear in 'target'
    var pos = 0;
    var num = -1;
    var i = -1;
    string = string.toLowerCase();
    message = $(target).val().toLowerCase();
    while (pos != -1) {
        pos = message.indexOf(string, i + 1);
        num += 1;
        i = pos;
    }
    return num;
}

function initrecepientlist() { //A group is expanded on the Send page, so set up the defaults and handle events

    var enabled = 0;

    $('#recepientlist input.recepientradio').die("change");

    $('#recepientlist input.recepientradio').bind("change", function () { //Toggle group highlighting and auto checkbox control
        confirmed = false;
        cancelled = false;
        $("#recepientlist div").each(function () {
            if ($(this).next("table").children("thead").length) {
                if (confirmed == false) {
                    confirmDialog = confirm("Selecting a new group/inbox will clear any filtering you have made on any open group/inbox listings.\nAre you sure you want to do this?");
                    if (confirmDialog) {
                        confirmed = true;
                    } else {
                        cancelled = true;
                        return false;
                    }
                }
            }
            ;

            if (cancelled)
                return false;

        });

        if (cancelled)
            return false;

        $('.recepientmemberlist').empty();

        $('.recepientmembers').removeClass('recepientmembersexpanded');

        $("#recepientlist li.selected").each(function () {
            $(this).removeClass("selected");
        });

        $('#recepientlist li div input[type="radio"]:checked').parent().parent().parent().parent().addClass("selected");

        id = $('#recepientlist input.recepientradio:checked').attr("id");

        if ($(this).is(":checked")) {
            $.post("/content/send-getorigin.php", {
                id: id
            }, function (data) {
                if (data != "") {
                    if (data == "xreplyx") {
                        $('input#message-from-reply1').siblings(".defRadio").trigger("click");
                    } else {
                        $('input#message-from-reply2').siblings(".defRadio").trigger("click");

                        $('select#message-from option').each(function () {
                            if ($(this).attr("value") != data) {
                                $(this).attr("selected", false);
                            } else {
                                $(this).attr("selected", true);
                            }
                        });

                        //if no sendernames, dont trigger adding one
                        if ($('select#message-from').val() != "Add Sender") {
                            $('select#message-from').change();
                        }
                    }
                    updateSendernameStatus();
                }
            });
        }
    });

    $('.recepientmembers').bind("click", function () {
        //console.log("run");
        //check for click bubbling
        //if(!$(this).parent().find("input.recepientradio").hasClass("hasRun")){
        //prevent click bubbling
        //$(this).parent().find("input.recepientradio").addClass("hasRun");
        var groupid = $(this).parent().next("table").attr("id");

        var groupcount = $(this).siblings(".recepientcount").children().first().text();

        if (groupcount > 1000 && !$(this).hasClass("recepientmembersexpanded")) { //Warn when expanding large groups
            if (!confirm("Expanding groups over 1000 contacts may cause some computers to slow down.\n\nAre you sure you want to expand this group?\n\nYou can view the contents of this group by clicking the Edit button.")) {
                return false;
            }
        }

        hasexpanded = false;

        sameexpand = false;

        if ($(this).parent().next("table").children("tbody").attr("id")) {
            sameexpand = true;
        }

        $('.recepientmembers').each(function () {
            if ($(this).hasClass("recepientmembersexpanded")) {
                hasexpanded = true;
            }
            ;
        });

        if (sameexpand) {
            if (confirm("Collapsing this group/inbox will clear any filtering you have done.\n\nAre you sure you want to do this?")) {
                $('.recepientmemberlist').empty();
                $('.recepientmembers').removeClass('recepientmembersexpanded');
                $('.recepientmemberlist').hide();
                return true;
            } else {
                return false;
            }
        }

        if (hasexpanded) {
            if (confirm("Selecting a different group/inbox will clear any filtering you have done.\n\nAre you sure you want to do this?")) {
                $('.recepientmemberlist').empty();
                $('.recepientmembers').removeClass('recepientmembersexpanded');
            } else {
                return false;
            }
        }

        $(this).toggleClass("recepientmembersexpanded");

        if ($(this).find(".showClose").width() > $(this).find(".showExpand").width()) {
            $(this).find(".showExpand").width($(this).find(".showClose").width());
        } else {
            $(this).find(".showClose").width($(this).find(".showExpand").width());
        }

        if ($(this).hasClass("recepientmembersexpanded")) {

            $(this).parent().next("table").show();
            $(this).parent().next("table").html("<tbody><tr><td width=\"340\"><span class=\"loading\"><span>Loading...</span></span></td></tr></tbody>");
            $(this).parent().next("table").load("/content/send-groupcontacts.php", {
                'groupid': groupid
            }, function () {

                $(this).parent().siblings().children().find("input:checkbox").attr("disabled", true).attr("checked", false);

                $(this).parent().siblings().children().find("td").addClass("disabled");

                $(this).parent().siblings().removeClass("selected");

                $(this).prev().removeClass("disabled").attr("checked", true).attr("disabled", false).parent().addClass("selected");

                $(this).parent().parent().find("input.recepientradio:checked").each(function () {
                    $(this).siblings("div.defRadio").removeClass("checked");
                    $(this).attr("checked", false);
                });

                $(this).prev().find("input.recepientradio").attr("checked", true).attr("disabled", false).click();

                $(this).prev().find("div.recepientradio").addClass("checked");

                $('#have-sentto-toggle').parent('div').show();
                $('#havenot-sentto-toggle').parent('div').show();

                $(this).find("input").attr("disabled", false);
                //$(this).find("input").attr("checked",true);
                $(this).find("label").removeClass("disabled");
            });

        }
        //} else {
        //remove click bubbling
        //$(this).parent().find("input.recepientradio").removeClass("hasRun");
        //}
    });

    $('#recepientlist input.recepientcheckbox').bind("change", function () { //Toggle group highlighting and auto checkbox control

        var enabled = 0;
        if ($(this).is(":checked")) {
            $(this).parent().parent().parent().addClass("selected");
        } else {
            $(this).parent().parent().parent().removeClass("selected");
        }

        $("#recepientlist input.recepientcheckbox:checked").each(function () { //Count how many checkboxes are checked
            enabled = enabled + 1;
            $(this).nextAll("a").removeClass("groupmembersexpanded");
        });

        $("#recepientlist input.recepientcheckbox:checked").each(function () {
            if ($(this).hasClass("offline")) {
                enabled = 0;
            }
        });

        $("#recepientlist input.recepientcheckbox:checked").each(function () {
            if ($(this).siblings(".uniquecoding").length) {
                enabled = 0;
            }
        });

        if (enabled > 0) { //We have checked boxes!
            $('#deletegroup').removeClass("disabled").attr("disabled", false).parent().removeClass("disabled");
            $('#editgroup').removeClass("disabled").attr("disabled", false).parent().removeClass("disabled");
            $('#mergegroups').removeClass("disabled");
            $('#splitgroup').removeClass("disabled").attr("disabled", false).parent().removeClass("disabled");
            $('#sendmessage').removeClass("disabled").attr("disabled", false).parent().removeClass("disabled");
            $('#selectioncount').html(enabled + " ");

            if (enabled == 1) { //One checkbox
                $('#selectioncountplural').empty();
                $('#recepientlist input.recepientcheckbox:checked').nextAll('a.groupmembers').addClass("groupmembersexpanded");
                $('#mergegroups').addClass("disabled");
                var groupid = $('#recepientlist .recepientcheckbox:checked').attr("id").substring(15);
                var type = $('#recepientlist li').attr("class");
                var data = new Array();
            }

            if (enabled > 1) { //More than one checkbox
                $('#selectioncountplural').html("s");
                $('#recepientlist input.recepientcheckbox:checked').nextAll("a").removeClass("groupmembersexpanded");
                $('#editgroup').addClass("disabled").attr("disabled", true).parent().addClass("disabled");
                $('#splitgroup').addClass("disabled").attr("disabled", true).parent().addClass("disabled");
                $('#sendmessage').addClass("disabled").attr("disabled", true).parent().addClass("disabled");
            }
        } else { //Nothing is checked
            $('#selectioncountplural').empty();
            $('#recepientlist a.groupmembersexpanded').removeClass("groupmembersexpanded");
            $('#deletegroup').addClass("disabled").attr("disabled", true).parent().addClass("disabled");
            $('#editgroup').addClass("disabled").attr("disabled", true).parent().addClass("disabled");
            $('#mergegroups').addClass("disabled");
            $('#splitgroup').addClass("disabled").attr("disabled", true).parent().addClass("disabled");
            $('#sendmessage').addClass("disabled").attr("disabled", true).parent().addClass("disabled");
            $('#selectioncount').empty();
        }
    });

    /*
     $('#recepientlist input.recepientcheckbox').bind("click", function () { //Toggle group highlighting and auto radio control
     var enabled = 0;
     if ($(this).attr("checked")) {
     $(this).parent().addClass("selected");
     } else {
     $(this).parent().removeClass("selected");
     }
     $("#recepientlist input.recepientcheckbox:checked").each(function () { //Count how many checkboxes are checked
     enabled = enabled + 1;
     $(this).nextAll("a").removeClass("groupmembersexpanded");
     });
     if (enabled > 0) { //We have checked boxes!
     $('#deleteseed').removeClass("button-disabled").attr("disabled", false);
     $('#editseed').removeClass("button-disabled").attr("disabled", false);
     $('#printcodes').removeClass("button-disabled").attr("disabled", false);
     $('#emailcodes').removeClass("button-disabled").attr("disabled", false);
     $('#selectioncount').html(enabled + " ");
     if (enabled == 1) { //One checkbox
     $('#selectioncountplural').empty();
     $('#recepientlist input.recepientcheckbox:checked').nextAll('a.groupmembers').addClass("groupmembersexpanded");
     var groupid = $('#recepientlist .recepientcheckbox:checked').attr("id").substring(15);
     var type = $('#recepientlist li').attr("class");
     var data = new Array();
     }
     } else { //Nothing is checked
     $('#selectioncountplural').empty();
     $('#recepientlist a.groupmembersexpanded').removeClass("groupmembersexpanded");
     $('#deleteseed').addClass("button-disabled").attr("disabled", true);
     $('#editseed').addClass("button-disabled").attr("disabled", true);
     $('#printcodes').addClass("button-disabled").attr("disabled", true);
     $('#emailcodes').addClass("button-disabled").attr("disabled", true);
     $('#selectioncount').empty();
     }
     });
     */

    function showhide(showid, hideid) {
        document.getElementById(showid).style.visibility = "visible";
        document.getElementById(hideid).style.visibility = "hidden";
    }

    /*
     $('.recepientmembers').bind("click",function() { //Toggle table of contacts within a group
     var groupid = $(this).parent().next("table").attr("id");
     var groupcount = $(this).prev("span").text();
     confirmed = false;
     expanded = false;
     var rows = $(this).parent().parent().parent().children();
     rows.each(function() {
     if ($(this).hasClass("recepientmembersexpanded")) {
     //console.log("HIT");
     } else {
     //console.log("MISS");
     }
     });
     if (groupcount>1000 && !$(this).hasClass("recepientmembersexpanded")) { //Warn when expanding large groups
     
     if (!confirm("Selecting a new group/inbox will clear any filtering you have made on any open group/inbox listings.\nAre you sure you want to do this?")) {
     return false;
     }
     }
     $(this).toggleClass("recepientmembersexpanded");
     if ($(this).hasClass("recepientmembersexpanded")) {
     $(this).parent().next("table").toggle().html("<tbody><tr><td width=\"340\"><span class=\"loading\"><span>Loading...</span></span></td></tr></tbody>");
     $(this).parent().next("table").load("/content/send-groupcontacts.php",{'groupid':groupid},function() {
     $(this).parent().siblings().children().find("input:checkbox").attr("disabled",true).attr("checked",false);
     $(this).parent().siblings().children().find("td").addClass("disabled");
     $(this).parent().siblings().children().removeClass("selected");
     $(this).prev().removeClass("disabled").attr("checked",true).attr("disabled",false).addClass("selected");
     $(this).prev().children("input.recepientradio").attr("checked",true).attr("disabled",false);
     $(this).find("input").attr("disabled",false);
     $(this).find("input").attr("checked",true);
     $(this).find("label").removeClass("disabled");
     });
     } else {
     if (confirm("If you collapse this group, you will lose any changes you have made to the selection. Are you sure?")) {
     $(this).parent().next("table").empty();
     confirmed = true;
     }
     else {
     $(this).toggleClass("recepientmembersexpanded");
     }
     }
     });
     */
}

function JT_init() { //Look for and control the tooltip spans
    $("span.tooltip")
            .hover(function () {
                JT_show($(this).attr("id"), this.id, $(this).attr("name"))
            }, function () {
                $('#JT').remove()
            })
            .click(function () {
                return false
            });
}

function JT_show(url, linkId, title) { //Handle the showing of tooltips
    if (!title) {
        title = "&nbsp;";
    }
    url = url.substr(8);
    url = url.split("+");
    url = url[0];
    var url = "/content/tooltips/" + url + ".php?width=250";
    var de = document.documentElement;
    var w = self.innerWidth || (de && de.clientWidth) || document.body.clientWidth;
    var hasArea = w - getAbsoluteLeft(linkId);
    var clickElementy = getAbsoluteTop(linkId) - 3; //set y position
    var queryString = url.replace(/^[^\?]+\??/, '');
    var params = parseQuery(queryString);
    if (params['width'] === undefined) {
        params['width'] = 250
    }
    ;
    if (params['link'] !== undefined) {
        $('#' + linkId).bind('click', function () {
            window.location = params['link']
        });
        $('#' + linkId).css('cursor', 'pointer');
    }
    if (hasArea > ((params['width'] * 1) + 75)) {
        $("body").append("<div id='JT' style='z-index:5000;width:" + params['width'] * 1 + "px'><div id='JT_arrow_left'></div><div id='JT_close_left'>" + title + "</div><div id='JT_copy'><div class='JT_loader'><div></div></div>"); //right side
        var arrowOffset = getElementWidth(linkId) + 11;
        var clickElementx = getAbsoluteLeft(linkId) + arrowOffset; //set x position
    } else {
        $("body").append("<div id='JT' style='width:" + params['width'] * 1 + "px'><div id='JT_arrow_right' style='left:" + ((params['width'] * 1) + 1) + "px'></div><div id='JT_close_right'>" + title + "</div><div id='JT_copy'><div class='JT_loader'><div></div></div>"); //left side
        var clickElementx = getAbsoluteLeft(linkId) - ((params['width'] * 1) + 15); //set x position
    }
    $('#JT').css({
        left: clickElementx + "px",
        top: clickElementy + "px"
    });
    $('#JT').show();
    $('#JT_copy').load(url);
}

function getElementWidth(objectId) { //Gets an elements width
    x = document.getElementById(objectId);
    return x.offsetWidth;
}

function getAbsoluteLeft(objectId) { //Get an object left position from the upper left viewport corner
    o = document.getElementById(objectId)
    oLeft = o.offsetLeft // Get left position from the parent object
    while (o.offsetParent != null) { // Parse the parent hierarchy up to the document element
        oParent = o.offsetParent // Get parent object reference
        oLeft += oParent.offsetLeft // Add parent left position
        o = oParent
    }
    return oLeft
}

function getAbsoluteTop(objectId) { //Get an object top position from the upper left viewport corner
    o = document.getElementById(objectId)
    oTop = o.offsetTop // Get top position from the parent object
    while (o.offsetParent != null) { // Parse the parent hierarchy up to the document element
        oParent = o.offsetParent // Get parent object reference
        oTop += oParent.offsetTop // Add parent top position
        o = oParent
    }
    return oTop
}

function parseQuery(query) {
    var Params = new Object();
    if (!query)
        return Params;
    var Pairs = query.split(/[;&]/);
    for (var i = 0; i < Pairs.length; i++) {
        var KeyVal = Pairs[i].split('=');
        if (!KeyVal || KeyVal.length != 2)
            continue;
        var key = unescape(KeyVal[0]);
        var val = unescape(KeyVal[1]);
        val = val.replace(/\+/g, ' ');
        Params[key] = val;
    }
    return Params;
}

function blockEvents(evt) {
    if (evt.target) {
        evt.preventDefault();
    } else {
        evt.returnValue = false;
    }
}

// START AJAX UPLOAD

function $m(theVar) {
    return document.getElementById(theVar)
}

function remove(theVar) {
    var theParent = theVar.parentNode;
    theParent.removeChild(theVar);
}

function addEvent(obj, evType, fn) {
    if (obj.addEventListener)
        obj.addEventListener(evType, fn, true)
    if (obj.attachEvent)
        obj.attachEvent("on" + evType, fn)
}

function removeEvent(obj, type, fn) {
    if (obj.detachEvent) {
        obj.detachEvent('on' + type, fn);
    } else {
        obj.removeEventListener(type, fn, false);
    }
}

function isWebKit() {
    return RegExp(" AppleWebKit/").test(navigator.userAgent);
}

function ajaxUpload(form, url_action, id_element, html_show_loading, html_error_http, targetid) {
    var detectWebKit = isWebKit();
    form = typeof (form) == "string" ? $m(form) : form;
    var erro = "";
    if (form == null || typeof (form) == "undefined") {

        erro += "The form of 1st parameter does not exists.\n";  // Not used
    } else if (form.nodeName.toLowerCase() != "form") {
        erro += "The form of 1st parameter its not a form.\n"; // Not used
    }
    if ($m(id_element) == null) {
        erro += "The element of 3rd parameter does not exists.\n"; // Not used
    }
    if (erro.length > 0) {
        alert("Error in call ajaxUpload:\n" + erro); // Never called
        return;
    }
    var iframe = document.createElement("iframe");
    iframe.setAttribute("id", "ajax-temp");
    iframe.setAttribute("name", "ajax-temp");
    iframe.setAttribute("width", "0");
    iframe.setAttribute("height", "0");
    iframe.setAttribute("border", "0");
    iframe.setAttribute("style", "width: 0; height: 0; border: none;");
    form.parentNode.appendChild(iframe);
    window.frames['ajax-temp'].name = "ajax-temp";
    var doUpload = function () {
        removeEvent($m('ajax-temp'), "load", doUpload);
        var cross = "javascript: ";
        cross += "window.parent.$m('" + id_element + "').innerHTML = document.body.innerHTML; void(0);";
        $m(id_element).innerHTML = html_error_http;
        $m('ajax-temp').src = cross;
        if (detectWebKit) {
            remove($m('ajax-temp'));
        } else {
            setTimeout(function () {
                remove($m('ajax-temp'))
            }, 250);
        }
        setTimeout(function () {
            doPageImgUpload()
        }, 250);
    }
    addEvent($m('ajax-temp'), "load", doUpload);
    form.setAttribute("target", "ajax-temp");
    form.setAttribute("action", url_action);
    form.setAttribute("method", "post");
    form.setAttribute("enctype", "multipart/form-data");
    form.setAttribute("encoding", "multipart/form-data");
    if (html_show_loading.length > 0) {
        $m(id_element).innerHTML = html_show_loading;
    }
    form.submit();
}

function doPageImgUpload() {
    var target = "#" + $('#imageUploadTarget').val();
    var src = $('#imageUploadPath').val();
    if (src !== undefined) {
        $(target).children("img").attr("src", src);
        setTimeout(function () {
            tb_remove()
        }, 750);
        return false;
    }
}

String.prototype.countOddChars = function (s1) {
    return (this.length - this.replace(new RegExp(s1, "g"), '').length) / s1.length;
}

function createNewSenderName(clickObj) {
    currentActiveAddSender = clickObj;

    $('body').append($('<div id="modalbg"></div>'));
    $('body').append('<div id="modalbox"><span class="closemodal">&#xf00d;</span><div id="modalinner"></div></div>');

    var opts = {
        lines: 11, // The number of lines to draw
        length: 0, // The length of each line
        width: 9, // The line thickness
        radius: 41, // The radius of the inner circle
        color: '#317BBC', // #rgb or #rrggbb or array of colors
        speed: 1.5, // Rounds per second
        trail: 100, // Afterglow percentage
        shadow: false, // Whether to render a shadow
        hwaccel: false, // Whether to use hardware acceleration
        className: 'spinner', // The CSS class to assign to the spinner
        zIndex: 2e9, // The z-index (defaults to 2000000000)
        top: '50%', // Top position relative to parent
        left: '50%' // Left position relative to parent
    };

    var modalBoxSpinner = document.getElementById('modalbg');
    var spinner = new Spinner(opts).spin(modalBoxSpinner);

    $('#modalinner').load('/ajax/add-sender.php', function () {
        $("#modalbg").html("");
        $('#canceladdsend, .closemodal').click(function () {
            if (currentActiveAddSender.val() == 'Add Sender') {
                currentActiveAddSender.find("option").first().attr('selected', 'selected');
                if (currentActiveAddSender.find("option").first().val() != "Add Sender") {
                    currentActiveAddSender.change();
                }
            }
            removeModal();
        });

        $('#contactsform').submit(function () {

            var newSenderName = $('#contactsform #name').val();

            $('#formsubresult').load('/ajax/add-sender-save.php', {
                'name': newSenderName
            }, function () {
                if (document.getElementById('successconf')) {
                    $('select.allowaddsender').each(function () {
                        if ($('#successconf').hasClass('off')) {
                            $($(this)).prepend('<option value="' + newSenderName + '">' + newSenderName + '</option>');
                        }

                        //$('.selectBox.allowaddsender ul.selectOptions').prepend('<li id="' + newSenderName + '">' + newSenderName + '</li>');

                        currentActiveAddSender.find("option").each(function () {
                            $(this).attr('selected', false);
                        });

                        currentActiveAddSender.find("option").first().attr('selected', 'selected');

                        buildSelectBox($(this));
                    });

                    $('select.allowreceivesender').each(function () {
                        $(this).prepend('<option value="' + newSenderName + '">' + newSenderName + '</option>');
                        buildSelectBox($(this));
                    });

                    currentActiveAddSender = false;

                    $('#sender-success').html('<div class="defContainer"><div id="" class="defNotice success " ><div class="icon">&#xf00c;</div><div class="noticeContent">Sender name requested</div></div></div>');

                    $('#modalbg').remove();
                    $('#modalbox').remove();
                }
            });

            return false;
        });
    });

    $('#modalbg').click(function () {
        if (currentActiveAddSender.val() == 'Add Sender')
            currentActiveAddSender.find("option:first").attr('selected', 'selected');
        removeModal();
    });
}

function createNewGroup(clickObj) {

    currentActiveGroup = clickObj;


    $('body').append($('<div id="modalbg"></div>'));
    $('body').append('<div id="modalbox"><span class="closemodal">&#xf00d;</span><div id="modalinner"></div></div>');

    var opts = {
        lines: 11, // The number of lines to draw
        length: 0, // The length of each line
        width: 9, // The line thickness
        radius: 41, // The radius of the inner circle
        color: '#317BBC', // #rgb or #rrggbb or array of colors
        speed: 1.5, // Rounds per second
        trail: 100, // Afterglow percentage
        shadow: false, // Whether to render a shadow
        hwaccel: false, // Whether to use hardware acceleration
        className: 'spinner', // The CSS class to assign to the spinner
        zIndex: 2e9, // The z-index (defaults to 2000000000)
        top: '50%', // Top position relative to parent
        left: '50%' // Left position relative to parent
    };

    var modalBoxSpinner = document.getElementById('modalbg');
    var spinner = new Spinner(opts).spin(modalBoxSpinner);

    $('#modalinner').load('/content/add-group.php', function () {
        $("#modalbg").html("");
        $('#canceladdsend').click(function () {
            if (currentActiveGroup.val() == 'Add Group')
                currentActiveGroup.find('option').first().attr('selected', 'selected');
            removeModal();
        });

        $('.closemodal').click(function () {
            if (currentActiveGroup.val() == 'Add Group')
                currentActiveGroup.find('option').first().attr('selected', 'selected');
            removeModal();
        });

        $('#contactsform').submit(function () {
            var newGroupName = $('#contactsform #name').val();

            $('#formsubresult').load('/ajax/add-group-save.php', {
                'name': newGroupName
            }, function () {
                if (document.getElementById('successconf')) {

                    $("select.allowaddgroup, select.allowreceivesender").each(function () {
                        $(this).prepend('<option value="' + newGroupName + '">' + newGroupName + '</option>');
                        buildSelectBox($(this));
                    });

                    selectBoxChange(currentActiveGroup, newGroupName);

                    currentActiveGroup = false;

                    $('#modalbg').remove();
                    $('#modalbox').remove();
                }
            });

            return false;
        });
    });

    $('#modalbg').click(function () {
        if ($('select.allowaddgroup').val() == 'Add Group') {
            $('select.allowaddgroup option:first').attr('selected', 'selected');
            buildSelectBox(currentActiveGroup);
        }
        removeModal();
        currentActiveGroup = false;
    });
}

function loadModal(urlToLoad) {
    $('body').append($('<div id="modalbg"></div>'));
    $('body').append('<div id="modalbox"><span class="closemodal">&#xf00d;</span><div id="modalinner"></div></div>');

    var opts = {
        lines: 11, // The number of lines to draw
        length: 0, // The length of each line
        width: 9, // The line thickness
        radius: 41, // The radius of the inner circle
        color: '#317BBC', // #rgb or #rrggbb or array of colors
        speed: 1.5, // Rounds per second
        trail: 100, // Afterglow percentage
        shadow: false, // Whether to render a shadow
        hwaccel: false, // Whether to use hardware acceleration
        className: 'spinner', // The CSS class to assign to the spinner
        zIndex: 2e9, // The z-index (defaults to 2000000000)
        top: '50%', // Top position relative to parent
        left: '50%' // Left position relative to parent
    };

    var modalBoxSpinner = document.getElementById('modalbg');
    var spinner = new Spinner(opts).spin(modalBoxSpinner);

    $.ajax({
        url: urlToLoad,
        success: function (data) {
            $("#modalbg").html("");
            $('#modalinner').html(data);

            if ($('.closemodal').length) {
                $('.closemodal').click(function () {
                    removeModal();
                });
            }
        }
    });

    $('#modalbg').click(function () {
        removeModal();
    });
}

function removeModal() {
    $('#modalbox').animate({
        opacity: 0,
        top: '50'
    }, 500, function () {
        $('#modalbox').remove();
    });

    $('#modalbg').animate({
        opacity: 0
    }, 500, function () {
        $('#modalbg').remove();
    });

    $(".colpick").remove();
}

function insertSurveyLink(pageid) {

    if (insertAreaID != undefined)
        textArea = insertAreaID;
    else
        textArea = $('#message-body');

    if (location.hostname == "control.txtlocallocal.co.uk") {
        insert = "http://txtest.vc/s/" + pageid + "/#PageTrack#";
    } else if (location.hostname == "control.txtlocalstage.co.uk") {
        insert = "http://stage.tx.vc/s/" + pageid + "/#PageTrack#";
    } else {
        insert = "https://tx.gl/s/" + pageid + "/#PageTrack#";
    }

    pos = caretPos;
    msg = textArea.val();
    msg1 = msg.substring(0, pos);
    msg2 = msg.substring(pos);

    if (pos != 0 && msg.substr(pos - 1, 1) != ' ') {
        msg3 = msg1 + ' ' + insert + msg2;
        pos = pos + insert.length + 1;
    }
    else {
        msg3 = msg1 + insert + msg2;
        pos = pos + insert.length;
    }

    textArea.val(msg3);
    textArea.focus();
    textArea.setCursorPosition(pos);
    //ticketing
    $(".additionalText").change();
    $(".additionalTextFoot").change();
    $(".itemText").change();
    setTimeout("countChars()", 1000);
    removeModal();
    closeInjectBoxes();
    messageChanged = true;
    return false;
}

function getQueryStrings() {
    var assoc = {};
    var decode = function (s) {
        return decodeURIComponent(s.replace(/\+/g, " "));
    };
    var queryString = location.search.substring(1);
    var keyValues = queryString.split('&');

    for (var i in keyValues) {
        var key = keyValues[i].split('=');
        if (key.length > 1) {
            assoc[decode(key[0])] = decode(key[1]);
        }
    }

    return assoc;
}

function updateOffer(bundle) {
    $.ajax({
        type: "GET",
        dataType: "json",
        url: "/ajax/offers.php",
        data: "bundleId=" + bundle,
        success: function (response) {
            if (response.nooffer) {
                $("#offerBox").hide();
                $("#offerText .noticeContent").text('');
            } else {
                $("#offerBox").show();
                $("#offerText .noticeContent").text(response.offerMessage);
            }
            return true;
        }
    });
}

var Base64 = {
// private property
    _keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
// public method for encoding
    encode: function (input) {
        var output = "";
        var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
        var i = 0;

        input = Base64._utf8_encode(input);

        while (i < input.length) {

            chr1 = input.charCodeAt(i++);
            chr2 = input.charCodeAt(i++);
            chr3 = input.charCodeAt(i++);

            enc1 = chr1 >> 2;
            enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
            enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
            enc4 = chr3 & 63;

            if (isNaN(chr2)) {
                enc3 = enc4 = 64;
            } else if (isNaN(chr3)) {
                enc4 = 64;
            }

            output = output +
                    this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) +
                    this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4);

        }

        return output;
    },
// public method for decoding
    decode: function (input) {
        var output = "";
        var chr1, chr2, chr3;
        var enc1, enc2, enc3, enc4;
        var i = 0;

        input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

        while (i < input.length) {

            enc1 = this._keyStr.indexOf(input.charAt(i++));
            enc2 = this._keyStr.indexOf(input.charAt(i++));
            enc3 = this._keyStr.indexOf(input.charAt(i++));
            enc4 = this._keyStr.indexOf(input.charAt(i++));

            chr1 = (enc1 << 2) | (enc2 >> 4);
            chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
            chr3 = ((enc3 & 3) << 6) | enc4;

            output = output + String.fromCharCode(chr1);

            if (enc3 != 64) {
                output = output + String.fromCharCode(chr2);
            }
            if (enc4 != 64) {
                output = output + String.fromCharCode(chr3);
            }

        }

        output = Base64._utf8_decode(output);

        return output;

    },
// private method for UTF-8 encoding
    _utf8_encode: function (string) {
        string = string.replace(/\r\n/g, "\n");
        var utftext = "";

        for (var n = 0; n < string.length; n++) {

            var c = string.charCodeAt(n);

            if (c < 128) {
                utftext += String.fromCharCode(c);
            }
            else if ((c > 127) && (c < 2048)) {
                utftext += String.fromCharCode((c >> 6) | 192);
                utftext += String.fromCharCode((c & 63) | 128);
            }
            else {
                utftext += String.fromCharCode((c >> 12) | 224);
                utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                utftext += String.fromCharCode((c & 63) | 128);
            }

        }

        return utftext;
    },
// private method for UTF-8 decoding
    _utf8_decode: function (utftext) {
        var string = "";
        var i = 0;
        var c = c1 = c2 = 0;

        while (i < utftext.length) {

            c = utftext.charCodeAt(i);

            if (c < 128) {
                string += String.fromCharCode(c);
                i++;
            }
            else if ((c > 191) && (c < 224)) {
                c2 = utftext.charCodeAt(i + 1);
                string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
                i += 2;
            }
            else {
                c2 = utftext.charCodeAt(i + 1);
                c3 = utftext.charCodeAt(i + 2);
                string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
                i += 3;
            }

        }

        return string;
    }

}

jQuery.base64 = (function ($) {

    var _PADCHAR = "=",
            _ALPHA = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",
            _VERSION = "1.0";


    function _getbyte64(s, i) {
// This is oddly fast, except on Chrome/V8.
// Minimal or no improvement in performance by using a
// object with properties mapping chars to value (eg. 'A': 0)

        var idx = _ALPHA.indexOf(s.charAt(i));

        if (idx === -1) {
            throw "Cannot decode base64";
        }

        return idx;
    }


    function _decode(s) {
        var pads = 0,
                i,
                b10,
                imax = s.length,
                x = [];

        s = String(s);

        if (imax === 0) {
            return s;
        }

        if (imax % 4 !== 0) {
            throw "Cannot decode base64";
        }

        if (s.charAt(imax - 1) === _PADCHAR) {
            pads = 1;

            if (s.charAt(imax - 2) === _PADCHAR) {
                pads = 2;
            }

// either way, we want to ignore this last block
            imax -= 4;
        }

        for (i = 0; i < imax; i += 4) {
            b10 = (_getbyte64(s, i) << 18) | (_getbyte64(s, i + 1) << 12) | (_getbyte64(s, i + 2) << 6) | _getbyte64(s, i + 3);
            x.push(String.fromCharCode(b10 >> 16, (b10 >> 8) & 0xff, b10 & 0xff));
        }

        switch (pads) {
            case 1:
                b10 = (_getbyte64(s, i) << 18) | (_getbyte64(s, i + 1) << 12) | (_getbyte64(s, i + 2) << 6);
                x.push(String.fromCharCode(b10 >> 16, (b10 >> 8) & 0xff));
                break;

            case 2:
                b10 = (_getbyte64(s, i) << 18) | (_getbyte64(s, i + 1) << 12);
                x.push(String.fromCharCode(b10 >> 16));
                break;
        }

        return x.join("");
    }


    function _getbyte(s, i) {
        var x = s.charCodeAt(i);

        if (x > 255) {
            throw "INVALID_CHARACTER_ERR: DOM Exception 5";
        }

        return x;
    }


    function _encode(s) {
        if (arguments.length !== 1) {
            throw "SyntaxError: exactly one argument required";
        }

        s = String(s);

        var i,
                b10,
                x = [],
                imax = s.length - s.length % 3;

        if (s.length === 0) {
            return s;
        }

        for (i = 0; i < imax; i += 3) {
            b10 = (_getbyte(s, i) << 16) | (_getbyte(s, i + 1) << 8) | _getbyte(s, i + 2);
            x.push(_ALPHA.charAt(b10 >> 18));
            x.push(_ALPHA.charAt((b10 >> 12) & 0x3F));
            x.push(_ALPHA.charAt((b10 >> 6) & 0x3f));
            x.push(_ALPHA.charAt(b10 & 0x3f));
        }

        switch (s.length - imax) {
            case 1:
                b10 = _getbyte(s, i) << 16;
                x.push(_ALPHA.charAt(b10 >> 18) + _ALPHA.charAt((b10 >> 12) & 0x3F) + _PADCHAR + _PADCHAR);
                break;

            case 2:
                b10 = (_getbyte(s, i) << 16) | (_getbyte(s, i + 1) << 8);
                x.push(_ALPHA.charAt(b10 >> 18) + _ALPHA.charAt((b10 >> 12) & 0x3F) + _ALPHA.charAt((b10 >> 6) & 0x3f) + _PADCHAR);
                break;
        }

        return x.join("");
    }


    return {
        decode: _decode,
        encode: _encode,
        VERSION: _VERSION
    };

}(jQuery));

function ExpandSelect(select, callback)
{
    maxOptionsVisible = 10;
    if (typeof maxOptionsVisible == "undefined") {
        maxOptionsVisible = 20;
    }
    if (typeof select == "string") {
        select = document.getElementById(select);
    }
    if (typeof window["ExpandSelect_tempID"] == "undefined") {
        window["ExpandSelect_tempID"] = 0;
    }
    window["ExpandSelect_tempID"]++;

    var rects = select.getClientRects();

// ie: cannot populate options using innerHTML.
    function PopulateOptions(select, select2)
    {
        select2.options.length = 0; // clear out existing items
        for (var i = 0; i < select.options.length; i++) {
            var d = select.options[i];
            select2.options.add(new Option(d.text, i))
        }
    }

    var select2 = document.createElement("SELECT");
//select2.innerHTML = select.innerHTML;
    PopulateOptions(select, select2);
    select2.style.cssText = "visibility: hidden;";
    if (select.style.width) {
        select2.style.width = select.style.width;
    }
    if (select.style.height) {
        select2.style.height = select.style.height;
    }
    select2.id = "ExpandSelect_" + window.ExpandSelect_tempID;

    select.parentNode.insertBefore(select2, select.nextSibling);
    select = select.parentNode.removeChild(select);

    if (select.length > maxOptionsVisible) {
        select.size = maxOptionsVisible;
    } else {
        select.size = select.length;
    }

    if ("pageXOffset" in window) {
        var scrollLeft = window.pageXOffset;
        var scrollTop = window.pageYOffset;
    } else {
// ie <= 8
// Function taken from here: http://help.dottoro.com/ljafodvj.php
        function GetZoomFactor()
        {
            var factor = 1;
            if (document.body.getBoundingClientRect) {
                var rect = document.body.getBoundingClientRect();
                var physicalW = rect.right - rect.left;
                var logicalW = document.body.offsetWidth;
                factor = Math.round((physicalW / logicalW) * 100) / 100;
            }
            return factor;
        }
        var zoomFactor = GetZoomFactor();
        var scrollLeft = Math.round(document.documentElement.scrollLeft / zoomFactor);
        var scrollTop = Math.round(document.documentElement.scrollTop / zoomFactor);
    }

    select.style.position = "absolute";
    select.style.left = (rects[0].left + scrollLeft) + "px";
    select.style.top = (rects[0].top + scrollTop) + "px";
    select.style.zIndex = "1000000";

    var keydownFunc = function (e) {
        e = e ? e : window.event;
// Need to implement hiding select on "Escape" and "Enter".
        if (e.altKey || e.ctrlKey || e.shiftKey || e.metaKey) {
            return 1;
        }
// Escape, Enter.
        if (27 == e.keyCode || 13 == e.keyCode) {
            select.blur();
            return 0;
        }
        return 1;
    };

    if (select.addEventListener) {
        select.addEventListener("keydown", keydownFunc, false);
    } else {
        select.attachEvent("onkeydown", keydownFunc);
    }

    var tempID = window["ExpandSelect_tempID"];

    var clickFunc = function (e) {
        e = e ? e : window.event;
        if (e.target) {
            if (e.target.tagName == "OPTION") {
                select.blur();
            }
        } else {
// IE case.
            if (e.srcElement.tagName == "SELECT" || e.srcElement.tagName == "OPTION") {
                select.blur();
            }
        }
    };

    if (select.addEventListener) {
        select.addEventListener("click", clickFunc, false);
    } else {
        select.attachEvent("onclick", clickFunc);
    }

    var blurFunc = function () {
        if (select.removeEventListener) {
            select.removeEventListener("blur", arguments.callee, false);
            select.removeEventListener("click", clickFunc, false);
            select.removeEventListener("keydown", keydownFunc, false);
        } else {
            select.detachEvent("onblur", arguments.callee);
            select.detachEvent("onclick", clickFunc);
            select.detachEvent("onkeydown", keydownFunc);
        }
        select.size = 1;
        select.style.position = "static";
        select = select.parentNode.removeChild(select);
        var select2 = document.getElementById("ExpandSelect_" + tempID);
        select2.parentNode.insertBefore(select, select2);
        select2.parentNode.removeChild(select2);

    };

    if (select.addEventListener) {
        select.addEventListener("blur", blurFunc, false);
    } else {
        select.attachEvent("onblur", blurFunc);
    }

    document.body.appendChild(select);
    select.focus();
}

function html_entity_decode(string) {
    return $('<div/>').html(string).text();
}

function testUnicode() {
    if (/[^\u0025\u0020\u0040\u0030\u0045\u0013\u0010\u0035\u00A1\u0050\u00BF\u0070\u00A3\u005F\u0021\u0031\u0041\u0051\u0061\u0071\u0024\u03A6\u0022\u0032\u0042\u0052\u0062\u0072\u00A5\u0393\u0023\u0033\u0043\u0053\u0063\u0073\u00E8\u039B\u00A4\u0034\u0044\u0054\u0064\u0074\u00E9\u03A9\u005E\u0055\u0065\u0075\u00F9\u03A0\u0026\u0036\u0046\u0056\u0066\u0076\u00EC\u03A8\u0027\u0037\u0047\u0057\u0067\u0077\u00F2\u03A3\u0028\u0038\u0048\u0058\u0068\u0078\u00C7\u0398\u0029\u0039\u0049\u0059\u0069\u0079\u039E\u002A\u003A\u004A\u005A\u006A\u007A\u00D8\u002B\u003B\u004B\u00C4\u006B\u00E4\u00F8\u00C6\u002C\u003C\u004C\u00D6\u006C\u00F6\u00E6\u002D\u003D\u004D\u00D1\u006D\u00F1\u00C5\u00DF\u002E\u003E\u004E\u00DC\u006E\u00FC\u00E5\u00C9\u002F\u003F\u004F\u00A7\u006F\u00E0\u20AC\u007B\u007D\u007E\u005B\u005D\u007C\u0394\u000D\u000A\u005C]/.test($('#message-body').val())) {
        $('#unicode-opt').val('true');
        isUnicode = true;
    } else {
        $('#unicode-opt').val('false');
        isUnicode = false;
    }
}

function html_entity_decode(string) {
    return $('<div/>').html(string).text();
}

function displayKeyboardReference(language) {
    console.log(language);
    var popupElement = $('<div class="keyboardReferencePopup"></div>');
    $('body').append(popupElement);

    $.ajax({
        url: '/ajax/keyboard-reference.php',
        data: {lang: language}
    }).done(function (response) {
        $(popupElement).html(response);

        $(popupElement).animate({
            bottom: "+=544"
        }, 500, 'easeOutCubic');
    });
}

function hideKeyboardReference() {
    $('.keyboardReferencePopup').animate({
        bottom: "-=544"
    }, 500, 'easeOutCubic');
}
