import LayoutPage from '../components/Layout'

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  return (
    <LayoutPage>
      <div>{children}</div>
    </LayoutPage>
  )
}
