import Layout from "@/components/layout"

export default function Home() {
  return (
    <div>
      Benvindo ao sistema ToDoList
    </div>
  )
}

Home.getLayout = function getLayout(page) {
  return (
    <Layout>
      {page}
    </Layout>
  )
}
