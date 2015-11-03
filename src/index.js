'use strict';

import React from 'react';
import Markdown from 'remarkable';
import toc from 'markdown-toc';

var Remarkable = React.createClass({

  getDefaultProps() {
    return {
      container: 'div',
      options: {},
    };
  },

  render() {
    var Container = this.props.container;

    return (
      <Container>
        {this.content()}
      </Container>
    );
  },

  componentWillUpdate(nextProps, nextState) {
    if (nextProps.options !== this.props.options) {
      this.md = new Markdown(nextProps.options);
    }
  },

  content() {
    if (this.props.source) {
      return <span dangerouslySetInnerHTML={{ __html: this.renderMarkdown(this.props.source) }} />;
    }
    else {
      return React.Children.map(this.props.children, child => {
        if (typeof child === 'string') {
          return <span dangerouslySetInnerHTML={{ __html: this.renderMarkdown(child) }} />;
        }
        else {
          return child;
        }
      });
    }
  },

  renderMarkdown(source) {
    if (!this.md) {
      this.md = new Markdown(this.props.options);
      this.md.renderer.rules.heading_open = function (tokens, idx /*, options, env */) {
        return '<a name="#' + toc.slugify(tokens[idx+1].content) + '"><h' + tokens[idx].hLevel + '>';
      }
      this.md.renderer.rules.heading_close = function (tokens, idx /*, options, env */) {
        return '</h' + tokens[idx].hLevel + '></a>\n';
      }
    }
    return this.md.render(source);
  }

});

export default Remarkable;
