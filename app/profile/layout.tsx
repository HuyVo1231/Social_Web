import LayoutPage from '../components/Layout'

export default async function ProfileLayout({ children }: { children: React.ReactNode }) {
  return (
    <LayoutPage>
      <div>{children}</div>
    </LayoutPage>
  )
}
