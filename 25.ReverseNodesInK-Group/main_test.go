package reverseKGroup

import (
	"testing"

	"github.com/stretchr/testify/assert"
)

type para struct {
	one *ListNode
	two int
}

type ans struct {
	one *ListNode
}

type question struct {
	p para
	a ans
}

func Test_OK(t *testing.T) {
	ast := assert.New(t)

	qs := []question{

		question{
			p: para{
				one: MakeListNode([]int{1, 2, 3, 4}),
				two: 2,
			},
			a: ans{
				one: MakeListNode([]int{2, 1, 4, 3}),
			},
		},
	}

	for _, q := range qs {
		a, p := q.a, q.p
		ast.Equal(a.one, reverseKGroup(p.one, p.two), "输入:%v", p)
	}

	// ast.Panics(func() { longestPalindrome([]int{}, []int{}) }, "对空切片求中位数，却没有panic")

}
