package wasm

import (
	"fmt"
	"syscall/js"

	"github.com/mickaelvieira/webcam-demo/wasm/canvas"
	"github.com/mickaelvieira/webcam-demo/wasm/channel"
)

func Init() js.Func {
	return js.FuncOf(func(this js.Value, args []js.Value) interface{} {
		fmt.Println("WASM module!!!")

		c := &channel.Channel{
			Channel: args[0],
		}

		c.Dispatch("wasm", "YO channel")

		doc := js.Global().Get("document")
		preview := doc.Call("querySelector", ".preview")
		document := doc.Call("querySelector", ".canvas")
		image := doc.Call("querySelector", ".image-cache")

		d := &canvas.Document{
			Canvas:  document,
			Channel: c,
			Image:   image,
		}
		p := &canvas.Preview{
			Canvas: preview,
		}

		fn := js.FuncOf(func(this js.Value, args []js.Value) interface{} {
			r := canvas.GetImageReader(args[0])
			// i := canvas.GetImageFromBytes(args[0])
			d.Update(r, 0)
			return nil
		})

		c.Subscribe("source_updated", fn)

		fmt.Println(p)
		return nil
	})

}
