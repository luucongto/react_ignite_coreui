import React, { Component } from 'react'
import { Card, CardBody, CardHeader, CarouselCaption, CarouselControl, CarouselIndicators, CarouselItem, Col, Row } from 'reactstrap'
import {Carousel} from 'react-responsive-carousel'
import underscore from 'underscore'
import 'react-responsive-carousel/lib/styles/carousel.min.css'
class CarouselsThumb extends Component {
  constructor (props) {
    super(props)
    this.state = { activeIndex: 0 }
    this.next = this.next.bind(this)
    this.previous = this.previous.bind(this)
    this.goToIndex = this.goToIndex.bind(this)
    this.onExiting = this.onExiting.bind(this)
    this.onExited = this.onExited.bind(this)
  }

  onExiting () {
    this.animating = true
  }

  onExited () {
    this.animating = false
  }

  next () {
    if (this.animating) return
    const nextIndex = this.state.activeIndex === this.props.items.length - 1 ? 0 : this.state.activeIndex + 1
    this.setState({ activeIndex: nextIndex })
  }

  previous () {
    if (this.animating) return
    const nextIndex = this.state.activeIndex === 0 ? this.props.items.length - 1 : this.state.activeIndex - 1
    this.setState({ activeIndex: nextIndex })
  }

  goToIndex (newIndex) {
    if (this.animating) return
    this.setState({ activeIndex: newIndex })
  }

  render () {
    let slides2
    if (this.props.renderCaption) {
      slides2 = this.props.items.map((item, index) => {
        return <div key={index}>
          <img src={item.src} />
          <p className='legend'>{item.caption}</p>
        </div>
      })
    } else {
      let items = underscore.uniq(this.props.items.map(item => item.src))
      slides2 = items.map((item, index) => {
        return <div key={index}>
          <img src={item} />
        </div>
      })
    }

    return (
      <Row className='animated fadeIn'>
        <Col xl='12'>
          <Carousel autoPlay>
            {slides2}
          </Carousel>
          {/* <Carousel activeIndex={activeIndex} next={this.next} previous={this.previous}>
            <CarouselIndicators items={this.props.items} activeIndex={activeIndex} onClickHandler={this.goToIndex} />
            {slides2}
            <CarouselControl direction='prev' directionText='Previous' onClickHandler={this.previous} />
            <CarouselControl direction='next' directionText='Next' onClickHandler={this.next} />
          </Carousel> */}
        </Col>
      </Row>
    )
  }
}

export default CarouselsThumb
