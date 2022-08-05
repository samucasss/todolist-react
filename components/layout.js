import BarraMenu from "./barramenu";

export default function Layout({ children }) {
  return (
    <>
        <BarraMenu></BarraMenu>
        <div className="container">{children}</div>
    </>
  )
}