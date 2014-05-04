function engine(DATASOURCE, entities) {
    var walk = _.walk(function(node) {
        if (_.isArray(node)) return node;
        return _.pick(node, 'children');
    });
    var ENTITY = {};
    function TemplateView(config) {
        this.config = config;
        this.children = [];
    }
    TemplateView.prototype = {
        $: function(selector) {
            return $(this._domNode).find(selector);
        },
        addChildView: function(childView) {
            this.children.push(childView);
        },
        setParentView: function(parentView) {
            this._parentView = parentView;
        },
        setHTML: function(html) {
            this._html = html;
        },
        render: function() {
            var $el = $(this._html);
            if ($el.length > 1) {
                $el = $('<div>').html($el);
            };
            
            if (this._domNode && this._domNode.parentNode) {
                this._domNode.parentNode.removeChild(this._domNode);
            }

            this._domNode = $el[0];

            var $container;
            if (!this.config.containerSelector) {
                $container = $(this._parentView._domNode);
            } else {
                if (/#/.test(this.config.containerSelector) || !this._parentView) {
                    $container = $(this.config.containerSelector);
                    if (!$container[0] && this._parentView) $container = this._parentView.$(this.config.containerSelector);
                } else if (this._parentView) {
                    $container = this._parentView.$(this.config.containerSelector);
                }
            }
            $container.eq(0).append(this._domNode);
        }
    };
    var RENDERABLE = {
        templateViewsMap: {},
        templateViews: [],
        parentTemplates: {},
        compiledTemplates: {},
        init: function() {
            var lastEntity;
            var self = this;
            this.orderedViews = walk.reduce(entities, function(memo, entity, key, parent) {
                if (key === 'children') return memo;
                if (!_.has(entity.components, 'template')) return memo;

                self.compiledTemplates[entity.components.template] = Handlebars.compile(entity.components.template);

                var newView = self.templateViewsMap[entity.uid] = new TemplateView({
                    entityUid: entity.uid,
                    containerSelector: entity.components.containerSelector
                });

                lastEntity = entity;

                // Non-leaf
                if (memo.children) {
                    _.each(_.map(memo.children, _.keys), function(childUid) {
                        self.parentTemplates[childUid] = entity.uid;
                        self.templateViewsMap[childUid].setParentView(newView);
                        newView.addChildView(self.templateViewsMap[childUid]);
                    }, self);

                    memo = {};
                    memo[entity.uid] = true;
                    return memo;
                }

                // Leaf
                memo = {};
                memo[entity.uid] = true;
                return memo;
            }, {}, this);

            var viewWalk = _.walk(function(node) {
                if (_.isArray(node)) return node;
                return _.pick(node, 'children');
            });
            viewWalk.preorder(this.templateViewsMap[lastEntity.uid], function(view, key, parent) {
                if (!(view instanceof TemplateView)) return;
                this.templateViews.push(view);
            }, this);
        },
        updateForDataSources: function() {
        },
        update: function(templateViews) {
            _.each(templateViews || this.templateViews, function(view) {
                var entity = ENTITY[view.config.entityUid];
                var template = this.compiledTemplates[entity.components.template];
                var datasourceName = entity.components.datasourceName;
                view.setHTML(template(DATASOURCE[datasourceName]));
            }, this);
        },
        render: function(templateViews) {
            _.invoke(templateViews || this.templateViews, 'render');
        }
    };
    function init() {
        walk.preorder(entities, function(entity, key, parent) {
            if (key === 'children') return;

            var uid = _.uniqueId('entity_');
            entity.uid = uid;
            ENTITY[uid] = entity;
        });
    }
    init();
    RENDERABLE.init();
    RENDERABLE.update();
    RENDERABLE.render();
    return {
        walk: walk,
        entities: entities,
        updateDatasource: function(pathStr, value) {
            var path = pathStr.split('.'),
                lastKey = path.pop(),
                datasourceName = _.first(path);
            if (_.isUndefined(value)) {
                _.result(_.getPath(DATASOURCE, path), lastKey);
            } else {
                _.getPath(DATASOURCE, path)[lastKey] = value;
            }

            var affectedViews = _.reduce(RENDERABLE.templateViews, function(reduced, view) {
                var uid = view.config.entityUid;
                if (ENTITY[uid].components.datasourceName === datasourceName) reduced[uid] = view;
                return reduced;
            }, {});

            RENDERABLE.update(affectedViews);
            RENDERABLE.render(affectedViews);
        }
    };
}
