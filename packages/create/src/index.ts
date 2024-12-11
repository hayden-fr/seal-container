import prompts from 'prompts'

async function init() {
  const result = await prompts([
    {
      type: 'text',
      name: 'projectName',
      message: 'Project name:',
      initial: 'seal-container-project',
    },
    {
      type: 'select',
      name: 'framework',
      message: 'Select a framework:',
      choices: [
        {
          title: 'React',
          value: 'react',
        },
        {
          title: 'Vue',
          value: 'vue',
        },
      ],
    },
    {
      type: 'select',
      name: 'component',
      message: 'Select a preset component:',
      choices: [
        {
          title: 'Ant Design',
          value: 'ant-design',
        },
        {
          title: 'Ant Design Vue',
          value: 'ant-design-vue',
        },
        {
          title: 'unnecessary',
          value: 'none',
        },
      ],
    },
  ])

  console.log(result)
}

init().catch((e) => {
  console.error(e)
})

export default {}
