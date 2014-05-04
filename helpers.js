Handlebars.registerHelper('feature', (function() {
    var tpl = Handlebars.compile('<div class="vocab">{{zh traditional}}<span class="english">{{english}}</span><span class="romanization mandarin">{{pinyin}}</span><span class="romanization cantonese">{{yale}}</span></div>');
    return function(word, options) {
        return new Handlebars.SafeString(tpl(DICTIONARY[word]));
    }
})());
Handlebars.registerHelper('vocab', (function() {
    var tpl = Handlebars.compile('<div class="vocab">{{zh traditional small=true}}<span class="english">{{english}}</span><span class="romanization mandarin">{{pinyin}}</span><span class="romanization cantonese">{{yale}}</span><a href="#{{traditional}}">&rarr;</a></div>');
    return function(word, options) {
        return new Handlebars.SafeString(tpl(DICTIONARY[word]));
    }
})());
Handlebars.registerHelper('mode-toggle', (function() {
    var tpl = Handlebars.compile('{{toggle str class="mode-toggle"}}');
    return function(str, options) {
        return new Handlebars.SafeString(tpl({
            str: str,
        }));
    }
})());
Handlebars.registerHelper('language-toggle', (function() {
    var tpl = Handlebars.compile('{{toggle str class="language-toggle"}}');
    return function(str, options) {
        return new Handlebars.SafeString(tpl({
            str: str,
        }));
    }
})());
Handlebars.registerHelper('toggle', (function() {
    var tpl = Handlebars.compile('<ol class="toggle {{class}}">{{#each words}}<li>{{{this}}}</li>{{/each}}</ol>');
    return function(str, options) {
        var hash = options.hash || {};
        return new Handlebars.SafeString(tpl(_.extend({
            words: str.split(/\s*\|\s*/)
        }, hash)));
    }
})());
Handlebars.registerHelper('zh', (function() {
    var tpl = Handlebars.compile('<span class="cycle {{class}} {{#if canCycle}}can-cycle{{/if}}">{{#each words}}<span class="zh {{../class}}">{{this}}</span>{{/each}}</span>');
    return function(word, options) {
        var hash = options.hash || {};
        var entry = DICTIONARY[word];
        var words = _.unique([entry.traditional, entry.simplified]);
        return new Handlebars.SafeString(tpl({
            canCycle: words.length > 1,
            words: words,
            'class': hash.small ? 'small' : 'zoom'
        }));
    }
})());

