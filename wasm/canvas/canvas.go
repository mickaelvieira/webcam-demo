package canvas

import (
	"bytes"
	"fmt"
	"image"
	_ "image/gif"
	_ "image/jpeg"
	_ "image/png"
	"io"
	"log"
	"math"
	"syscall/js"
)

type Dimensions struct {
	Width  float64
	Height float64
}

func getCanvasDimensions(c js.Value) *Dimensions {
	w := c.Get("width").Float()
	h := c.Get("height").Float()

	return &Dimensions{
		Width:  w,
		Height: h,
	}
}

func getBoundaries(d *Dimensions, a int) *Dimensions {
	if a == 90 || a == 270 {
		return &Dimensions{
			Width:  d.Height,
			Height: d.Width,
		}
	}
	return d
}

func calculateAspectRatioFit(srcWidth float64, srcHeight float64, maxWidth float64, maxHeight float64) *Dimensions {
	ratio := math.Min(maxWidth/srcWidth, maxHeight/srcHeight)

	fmt.Println(ratio)

	return &Dimensions{
		Width:  srcWidth * ratio,
		Height: srcHeight * ratio,
	}
}

func drawImage(canvas js.Value, bytes js.Value, url string, imageDimensions *Dimensions, shapeDimensions *Dimensions, angle int) {
	ctx := canvas.Call("getContext", "2d")

	if ctx.IsNull() {
		panic("Cannot get 2d context")
	}

	canvasWidth := canvas.Get("width").Float()
	canvasHeight := canvas.Get("height").Float()

	// save current state
	ctx.Call("save")

	// clear previous drawing
	ctx.Call("clearRect", 0, 0, canvasWidth, canvasHeight)

	// apply background
	ctx.Set("fillStyle", "white")
	ctx.Call("fillRect", 0, 0, canvasWidth, canvasHeight)

	// align shape's center with canvas' center
	canvasCenterX := canvasWidth / 2
	canvasCenterY := canvasHeight / 2

	ctx.Call("translate", canvasCenterX, canvasCenterY)
	ctx.Call("translate", (shapeDimensions.Width/2)*-1, (shapeDimensions.Height/2)*-1)

	// rotate image
	shapeCenterX := shapeDimensions.Width / 2
	shapeCenterY := shapeDimensions.Height / 2

	deg := math.Pi / float64(180) * float64(angle)

	ctx.Call("translate", shapeCenterX, shapeCenterY)
	ctx.Call("rotate", deg)
	ctx.Call("translate", -shapeCenterX, -shapeCenterY)

	// img := js.Global().Call("createDOMImage", url)

	fmt.Println("before draw")
	fmt.Println(shapeDimensions.Width)
	fmt.Println(shapeDimensions.Height)
	fmt.Println(imageDimensions.Width)
	fmt.Println(imageDimensions.Height)
	// Draw image at the given coordinates
	ctx.Call("drawImage",
		bytes,
		0,
		0,
		imageDimensions.Width,
		imageDimensions.Height,
		0,
		0,
		shapeDimensions.Width,
		shapeDimensions.Height,
	)

	fmt.Println("after draw")

	// restore previously saved state
	ctx.Call("restore")
}

func getImageDimensions(b []byte) *Dimensions {
	r := bytes.NewReader(b)
	c, f, err := image.DecodeConfig(r)
	if err != nil && err != image.ErrFormat {
		fmt.Println("FAILED")
		log.Fatal(err)
	}
	fmt.Println("Width:", c.Width, "Height:", c.Height, "Format:", f)

	return &Dimensions{
		Width:  float64(c.Width),
		Height: float64(c.Height),
	}
}

func GetImageReader(a js.Value) io.Reader {
	buf := make([]uint8, a.Get("byteLength").Int())
	js.CopyBytesToGo(buf, a)

	return bytes.NewReader(buf)
}

func getImageFromReader(b []byte) image.Image {
	r := bytes.NewReader(b)
	i, _, err := image.Decode(r)
	if err != nil {
		panic(err)
	}
	return i
}

Thomas Lourdaux

func GetImageFromBytes(a js.Value) image.Image {

	buf := make([]uint8, a.Get("byteLength").Int())
	js.CopyBytesToGo(buf, a)

	reader := bytes.NewReader(buf)
	i, _, err := image.Decode(reader)
	if err != nil {
		panic(err)
	}

	return i
}
