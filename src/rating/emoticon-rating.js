/*
Copyright (c) 2018-2020 Uber Technologies, Inc.

This source code is licensed under the MIT license found in the
LICENSE file in the root directory of this source tree.
*/

// @flow

import * as React from 'react';
import type {EmoticonRatingPropsT, RatingStateT} from './types.js';
import {StyledRoot, StyledEmoticon} from './styled-components.js';
import {getOverrides} from '../helpers/overrides.js';
import {ARROW_UP, ARROW_DOWN, ARROW_LEFT, ARROW_RIGHT} from './utils.js';
import {isFocusVisible, forkFocus, forkBlur} from '../utils/focusVisible.js';

class EmoticonRating extends React.Component<
  EmoticonRatingPropsT,
  RatingStateT,
> {
  static defaultProps = {
    overrides: {},
  };

  state = {isFocusVisible: false, previewIndex: undefined};

  selectItem = (value: number) => {
    const {onChange} = this.props;

    onChange && onChange({value});
    this.setState({previewIndex: undefined});
  };

  updatePreview = (previewIndex?: number) => {
    this.setState({previewIndex});
  };

  handleFocus = (event: SyntheticEvent<>) => {
    if (isFocusVisible(event)) {
      this.setState({isFocusVisible: true});
    }
  };

  handleBlur = (event: SyntheticEvent<>) => {
    if (this.state.isFocusVisible !== false) {
      this.setState({isFocusVisible: false});
    }
  };

  renderRatingContents = () => {
    const {overrides = {}, value = -1} = this.props;
    const {previewIndex} = this.state;
    const size = this.props.size;
    const [Emoticon, emoticonProps] = getOverrides(
      overrides.Item,
      StyledEmoticon,
    );
    const ratings = [];
    const refs = [{current: null}];
    for (let x = 1; x <= 5; x++) {
      const isFocusable = x === value || (value < 1 && x === 1);
      const starRef = React.createRef<HTMLLIElement>();
      refs.push(starRef);

      ratings.push(
        <Emoticon
          key={x}
          role="radio"
          // eslint-disable-next-line flowtype/no-weak-types
          ref={(starRef: any)}
          tabIndex={isFocusable ? '0' : '-1'}
          aria-setsize={5}
          aria-checked={x === value}
          size={size}
          aria-posinset={x}
          $index={x}
          $isActive={
            previewIndex !== undefined ? x === previewIndex : x === value
          }
          $isSelected={x === previewIndex}
          $isFocusVisible={this.state.isFocusVisible && isFocusable}
          onClick={() => this.selectItem(x)}
          onKeyDown={e => {
            if (e.keyCode === ARROW_UP || e.keyCode === ARROW_LEFT) {
              e.preventDefault && e.preventDefault();
              // 5 value comes from non-configurable number of icons
              const prevIndex = value - 1 < 1 ? 5 : value - 1;
              this.selectItem(prevIndex);
              refs[prevIndex].current && refs[prevIndex].current.focus();
            }
            if (e.keyCode === ARROW_DOWN || e.keyCode === ARROW_RIGHT) {
              e.preventDefault && e.preventDefault();
              const nextIndex = value + 1 > 5 ? 1 : value + 1;
              this.selectItem(nextIndex);
              refs[nextIndex].current && refs[nextIndex].current.focus();
            }
          }}
          onMouseOver={() => this.updatePreview(x)}
          onFocus={forkFocus(emoticonProps, this.handleFocus)}
          onBlur={forkBlur(emoticonProps, this.handleBlur)}
          {...emoticonProps}
        />,
      );
    }

    return ratings;
  };

  render() {
    const {overrides = {}} = this.props;
    const [Root, rootProps] = getOverrides(overrides.Root, StyledRoot);

    return (
      <Root
        data-baseweb="emoticon-rating"
        role="radiogroup"
        onBlur={() => this.updatePreview(undefined)}
        onMouseLeave={() => this.updatePreview(undefined)}
        {...rootProps}
      >
        {this.renderRatingContents()}
      </Root>
    );
  }
}

export default EmoticonRating;
