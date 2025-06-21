import { Fragment } from "react";


export const dynamic = "force-dynamic";
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <Fragment>
      {children}
    </Fragment>
   
  )
}