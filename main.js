$('#main')
    .css({
        position: 'absolute',
        top:0,
        left:0,
        right:0,
        bottom:0,
    })
    .split({
        orientation: 'vertical',
        limit: 10,
        position: '30%' // if there is no percentage it interpret it as pixels
    });

$('#main .workarea')
    .css({
        position: 'absolute',
        top:0,
        left:0,
        right:0,
        bottom:0,
    })
    .split({
        orientation: 'horizontal',
        limit: 10,
        position: '50%' // if there is no percentage it interpret it as pixels
    });



var xx = engine(
    {
        system: {
            now: function() {
                return new Date();
            }
        },
        session: {
            fullName: 'Kee-Yip Chan'
        }
    },
    {
        name: 'root',
        components: {
            containerSelector: '#main .preview',
            template: '<div class="application"><div class="header"></div><div class="content"></div><div class="footer"></div></div>'
        },
        children: [
            {
                name: 'Bottom',
                components: {
                    containerSelector: '.footer',
                    template: '{{mode-toggle "Preview|Work"}}'
                },
            },
            {
                name: 'Toolbar',
                components: {
                    containerSelector: '.header',
                    template: '{{language-toggle "Cantonese|Mandarin"}}'
                },
            },
            {
                name: 'Header',
                components: {
                    containerSelector: '.header',
                    template: '{{feature "鳥"}}'
                },
            },
            {
                name: 'Word details',
                components: {
                    containerSelector: '.content',
                    template: '<div class="word-details"></div>'
                },
                children: [
                    {
                        name: 'Vocabulary',
                        components: {
                            template: '<div class="column"><h2>Related Words</h2>{{vocab "隹"}}{{vocab "鷄"}}{{vocab "雞"}}</div>'
                        }
                    },
                    {
                        name: 'Mentioned words',
                        components: {
                            template: '<div class="column"><h2>Mentioned Words</h2>{{vocab "魚"}}{{vocab "爪"}}{{vocab "幺"}}{{vocab "大"}}</div>'
                        }
                    },
                ]
            },
            {
                name: 'Articles',
                components: {
                    containerSelector: '.content',
                    template: '<div class="articles"></div>'
                },
                children: [
                    {
                        name: 'Two words for ..',
                        components: {
                            template: '<div class="section"><h2>Two words for Bird: {{zh "鳥" small=true}} and {{zh "隹" small=true}}</h2><p>There are two characters for "bird". Both are radicals for Chicken and various other poultry, so it is good to be able to recognize them. Just to confuse you, these radicals generally appear on the right rather than the left, as you will see in the next post about chicken.</p><p>{{zh "鳥" small=true}} just means "bird" and it is the most often used. It looks a little like fish {{zh "魚" small=true}}, which I will get to later. It does not really look much like a bird to me, unless I see the top as a bird\'s head, and the bottom as a spread-out wing. (And that helps you separate it from fish, because the four dots underneath are enclosed by the wingtip.)</p><p>{{zh "隹" small=true}} means <em>short-tailed bird</em>, which is odd, because (for food birds at least) it only seems to be used for chicken -- and roosters have long tails. Whereas ducks, which never seem to use {{zh "隹" small=true}}, always have short tails. The best way to remember it is that it looks like a hen house.</p></div>'
                        }
                    },
                    {
                        name: 'Two chickens..',
                        components: {
                            template: '<div class="section"><h2>A Tale of Two Chickens: {{zh "鷄" small=true}} and {{zh "雞" small=true}}</h2><p>Just as there are two symbols for bird, there are two for chicken {{zh "鷄" small=true}} and {{zh "雞" small=true}}, and they both stand for the same word: ji. The difference does not hold much meaning -- it is just which radical they happen to use at a particular restaurant. You will notice that the radical in this case is on the right.</p><p>The part on the left is the part that indicates it is a chicken and not some other bird. It is made up of three stacked characters. Claw {{zh "爪" small=true}}, thread {{zh "幺" small=true}} and big {{zh "大" small=true}}. I am thinking it means "big scratcher bird." But that does not make it so easy to recognize.</p><p>A friend thought the second version looks like chickens scratching around outside a hen house. And that, I think, is the best way to remember it. It is common enough that you can just make a point of identifying it on any menu, and you will learn it. (Assignment: find a takeout menu with Chinese on it. Which version does that restaurant use?)</p></div>'
                        }
                    }
                ]
            }
        ]
    }
);
function logged(x) {
    console.log(x);
    return x;
}
$('#main .explorer').aciTree({
    autoInit: true,
    expand: true,
    fullRow: true,
    show: {
        props: {
            'height': 'show'
        },
        duration: 'medium',
        easing: 'linear'
    },
    view: {
        duration: 'medium',
        easing: 'linear'
    },
    rootData: logged([xx.walk.reduce(xx.entities, function(memo, value, key, parent) {
        if (key === 'children') return memo;

        // Non-leaf
        if (memo.children) {
            return {id:value.uid, inode: !_.isEmpty(memo.children), branch:memo.children, label: value.name || _.keys(value.components).join(', ')};
        }

        // Leaf
        return {id:value.uid, label: value.name || _.keys(value.components).join(', ')};
    }, {})])
});

function isTextSelected() {
    return !_.result(window.getSelection(), 'isCollapsed');
}
$('body').on('click', '.cycle', function(event) {
    if (isTextSelected()) return;
    event.preventDefault();
    $(this).find('>:first-child').appendTo(this);
});
$('body').on('click', '.toggle:not(.animating)', function(event) {
    if (isTextSelected()) return;
    var $toggle = $(this);
    $toggle.addClass('animating');
    var $current = $toggle.children().eq(0);
    var $next = $toggle.children().not($current);
    $current.addClass('move-out');
    $next.addClass('move-in');
    setTimeout(function() {
        $toggle.removeClass('animating');
        $next.removeClass('move-in')
        $current.removeClass('move-out');
        $current.appendTo($toggle);
        setRomanization();
        setMode();
    }, 300);
});
function setRomanization() {
    $('body').attr('data-romanization', $('.language-toggle').children().eq(0).text().toLowerCase());
}
function setMode() {
    $('body').attr('data-mode', $('.mode-toggle').children().eq(0).text().toLowerCase());
}
setRomanization();
setMode();
