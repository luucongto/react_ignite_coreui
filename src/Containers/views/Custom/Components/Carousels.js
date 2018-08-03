import React, { Component } from 'react'
import { Card, CardBody, CardHeader, Carousel, CarouselCaption, CarouselControl, CarouselIndicators, CarouselItem, Col, Row } from 'reactstrap'

class Carousels extends Component {
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
    const { activeIndex } = this.state

    const slides2 = this.props.items.map((item) => {
      return (
        <CarouselItem
          className='carousel-item'
          onExiting={this.onExiting}
          onExited={this.onExited}
          key={item.src}
        >
          <img className='d-block w-100' src={item.src} />
          <CarouselCaption className='text-danger' captionText={item.caption} />
        </CarouselItem>
      )
    })

    return (
      <Row className='animated fadeIn'>
        <Col xl='12'>
          <Carousel activeIndex={activeIndex} next={this.next} previous={this.previous}>
            <CarouselIndicators items={this.props.items} activeIndex={activeIndex} onClickHandler={this.goToIndex} />
            {slides2}
            <CarouselControl direction='prev' directionText='Previous' onClickHandler={this.previous} />
            <CarouselControl direction='next' directionText='Next' onClickHandler={this.next} />
          </Carousel>
        </Col>
      </Row>
    )
  }
}

export default Carousels
