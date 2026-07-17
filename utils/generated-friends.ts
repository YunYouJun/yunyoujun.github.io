import type { FriendLink } from './friends'
import { normalizeFriends } from './friends'

const generatedModules = import.meta.glob<{ default: FriendLink[] }>(
  '../.valaxy/friends.generated.ts',
  { eager: true },
)

const generatedFriends = normalizeFriends(
  generatedModules['../.valaxy/friends.generated.ts']?.default,
)

export default generatedFriends
