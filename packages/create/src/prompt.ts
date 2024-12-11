import readline from 'readline'

export function questions() {}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

const options = ['选项1', '选项2', '选项3']
let currentIndex = 0

function printOptions() {
  console.log(`请选择一个选项（当前选中：${options[currentIndex]}）:`)
  options.forEach((option, index) => {
    process.stdout.write(`${index + 1}: ${option}\n`)
  })
}

printOptions()

rl.on('line', (input) => {
  if (input === 'q') {
    rl.close()
    return
  }

  const selectedIndex = parseInt(input, 10) - 1
  if (selectedIndex >= 0 && selectedIndex < options.length) {
    currentIndex = selectedIndex
    console.log(`你选择了：${options[currentIndex]}`)
    rl.close()
  } else {
    console.log('无效的选项，请重新输入。')
  }
})

// rl.setRawMode(true)
process.stdin.setRawMode(true)
rl.input.setEncoding('utf8')

rl.input.on('data', (chunk) => {
  if (chunk === '\u001b[A') {
    // 上箭头
    if (currentIndex > 0) {
      currentIndex--
      printOptions()
    }
  } else if (chunk === '\u001b[B') {
    // 下箭头
    if (currentIndex < options.length - 1) {
      currentIndex++
      printOptions()
    }
  }
})
