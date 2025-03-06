import prisma from '@/app/libs/prismadb'
import getSession from './getSession'

const getOtherUsers = async () => {
  try {
    const session = await getSession()

    if (!session?.user?.email) {
      return null
    }

    const otherUsers = await prisma.user.findMany({
      where: {
        email: { not: session.user.email }
      }
    })

    return otherUsers
  } catch (error) {
    console.error(error)
    return null
  }
}

export default getOtherUsers
