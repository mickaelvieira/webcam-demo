package main

import (
	"syscall/js"

	"github.com/mickaelvieira/webcam-demo/wasm"
)

// var cb = js.FuncOf(func(this js.Value, args []js.Value) interface{} {
// 	fmt.Println(this.Call("getAttribute", "class"))
// 	fmt.Println(args[0].Get("target").Call("getAttribute", "class"))

// 	return nil
// })

// var handler = js.FuncOf(func(this js.Value, args []js.Value) interface{} {
// 	fmt.Println(args)

// 	return nil
// })

// var initChannel = js.FuncOf(func(this js.Value, args []js.Value) interface{} {
// 	channel := args[0]
// 	channel.Call("subscribe", "image_updated", handler)
// 	channel.Call("dispatch", "wasm", "YO channel")
// 	return nil
// })

func main() {

	done := make(chan struct{})

	js.Global().
		Get("CanvasVideo").
		Set("initChannel", wasm.Init())

	// js.Global().Get("document").
	// 	Call("querySelector", ".btn-rotate-left").
	// 	Call("addEventListener", "click", cb)

	<-done
}
