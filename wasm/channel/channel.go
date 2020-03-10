package channel

import (
	"syscall/js"
)

type Channel struct {
	Channel js.Value
}

func (c *Channel) Subscribe(event string, handler js.Func) {
	c.Channel.Call("subscribe", event, handler)
}

func (c *Channel) Unsubscribe(event string, handler js.Func) {
	c.Channel.Call("unsubscribe", event, handler)
}

func (c *Channel) Dispatch(event string, args ...interface{}) {
	c.Channel.Call("dispatch", event, args)
}
