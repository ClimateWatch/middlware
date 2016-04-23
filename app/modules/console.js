define(['marionette', 'underscore', 'text!templates/Console.html'], function(Marionette, _, ConsoleTpl) {



    var ChartView = Marionette.ItemView.extend({
        template: _.template('<h2><%=title%></h2><div class="content"></div>'),
        initialize: function() {
            // console.log()
        },
        onRender: function() {
            var mapped = this.mapData('actual');
            this.renderChart();
        },
        mapData: function(line) {
            var self = this;

            var filtered = this.collection.filter(function(item) {
                return (item.get('properties')[self.options.type][self.options.property][line]);
            });

            var mapped = _.map(filtered, function(item) {
                var output = [new Date(item.get('properties')[self.options.type].timestamp).getTime(), parseFloat(item.get('properties')[self.options.type][self.options.property][line])];
                return output;
            });
            console.log('mapped', mapped);
            var sorted = _.sortBy(mapped, function(item) {
                return item[0];
            })
            return sorted;

        },
        renderChart: function() {
            var self = this;

            // var average = _.map(data, function(item) {
            //     return [item[0],self.model.get('average')]
            // });

            var chart = new Highcharts.StockChart({
                chart: {
                    renderTo: self.$('.content')[0],
                    height: 300,
                    width: ($(window).width() / 2) - 40
                },

                series: [{
                    name: self.options.property,
                    // color: '#282727',
                    color: 'rgba(34, 34, 34, 0.73)',
                    data: self.mapData('actual'),
                    // dashStyle : 'LongDash',
                    softThreshold : true,
                    lineWidth : 4,
                    // step: true
                }, {
                    name: self.options.property,
                    color: 'red',
                    data: self.mapData('red')
                }, {
                    name: self.options.property,
                    color: 'yellow',
                    data: self.mapData('yellow')
                }, {
                    name: self.options.property,
                    color: 'green',
                    data: self.mapData('green')
                }]
            });
        }
    })

    var ConsoleView = Marionette.ItemView.extend({
        template: _.template(ConsoleTpl),
        initialize: function() {


            // "properties": {[
            // "air quality"
            // {
            // "NO2 - mg/m3": 
            // {
            //     "red": "10.0",
            //     "yellow": "8.0",
            //     "green": "5.0",
            //     "actual": "6.0"
            // }
            // "timestamp": "2013-10-29T18:44:48Z"
            // }
            // ]
            // }


            this.NO2 = new ChartView({
                collection: this.collection,
                property: 'NO2',
                type: 'airquality',
                model: new Backbone.Model({
                    title: 'NO2',
                    average: 40
                })
            });
            this.ozone = new ChartView({
                collection: this.collection,
                property: 'ozone',
                type: 'airquality',
                model: new Backbone.Model({
                    title: 'ozone',
                    average: 120
                })
            });

            this.temperature = new ChartView({
                collection: this.collection,
                property: 'temperature',
                type: 'temperature',
                model: new Backbone.Model({
                    title: 'temperature',
                    average: 25
                })
            });

            this.CO = new ChartView({
                collection: this.collection,
                property: 'CO',
                type: 'airquality',
                model: new Backbone.Model({
                    title: 'CO',
                    average: 10
                })
            });
        },
        events: {
            'click .panel-title': 'onPanelToggle',
            'click .close-button' : 'destroy'
        },
        onRender: function() {

            this.$('.chart-wrapper').append('<div class="panel airquality open"><div class="panel-title">Air Quality</div><div class="panel-content"></div></div>');
            this.$('.chart-wrapper').append('<div class="panel temperature"><div class="panel-title">Temperature</div><div class="panel-content"></div></div>');

            this.$('.airquality .panel-content').append(this.NO2.render().el);
            this.$('.airquality .panel-content').append(this.ozone.render().el);
            this.$('.airquality .panel-content').append(this.CO.render().el);
            this.$('.temperature .panel-content').append(this.temperature.render().el);
        },
        onPanelToggle: function(ev) {
            $(ev.target).closest('.panel').toggleClass('open')
        },

    });

    return {
        open: function(options) {

            if (this.consoleView) this.consoleView.destroy();

            this.consoleView = new ConsoleView({
                collection: new Backbone.Collection(options.geojson)
            });

            $('.console').html(this.consoleView.render().el);
        }
    }

});
