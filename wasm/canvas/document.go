package canvas

import (
	"encoding/base64"
	"fmt"
	"io"
	"io/ioutil"
	"syscall/js"

	"github.com/mickaelvieira/webcam-demo/wasm/channel"
)

type Document struct {
	Canvas  js.Value
	Channel *channel.Channel
	Image   js.Value
}

func (d *Document) Update(r io.Reader, angle int) {

	bytes, _ := ioutil.ReadAll(r)

	fmt.Println(len(bytes))
	imageDimensions := getImageDimensions(bytes)
	// image := getImageFromReader(bytes)
	canvasDimensions := getCanvasDimensions(d.Canvas)
	shape := getBoundaries(canvasDimensions, angle)
	url := base64.StdEncoding.EncodeToString(bytes)

	shapeDimensions := calculateAspectRatioFit(
		imageDimensions.Width,
		imageDimensions.Height,
		shape.Width,
		shape.Height,
	)

	drawImage(d.Canvas, d.Image, url, imageDimensions, shapeDimensions, angle)
	// this.channel.dispatch(EventName.DocumentWasUpdated, this.canvas)
}
