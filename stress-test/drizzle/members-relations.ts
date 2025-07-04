import { relations } from "drizzle-orm";
import { members } from "./members.js";
import { users } from "./users.js";
import { memberToCommunities } from "./member-to-communities.js";
import { posts } from "./posts.js";
import { postLikes } from "./post-likes.js";
import { postComments } from "./post-comments.js";
import { commentLikes } from "./comment-likes.js";
import { memberSessions } from "./member-sessions.js";
import { memberToChats } from "./member-to-chats.js";
import { chatMessages } from "./chat-messages.js";
import { memberToCourses } from "./member-to-courses.js";
import { memberCourseSectionProgresses } from "./member-course-section-progresses.js";
import { communityNotifications } from "./community-notifications.js";

export const membersRelations = relations(members, (helpers) => ({
  user: helpers.one(users, {
    relationName: "MemberToUser",
    fields: [members.userId],
    references: [users.id],
  }),
  memberToCommunities: helpers.many(memberToCommunities, {
    relationName: "MemberToMemberToCommunity",
  }),
  posts: helpers.many(posts, { relationName: "MemberToPost" }),
  likes: helpers.many(postLikes, { relationName: "MemberToPostLike" }),
  postComments: helpers.many(postComments, {
    relationName: "MemberToPostComment",
  }),
  commentLikes: helpers.many(commentLikes, {
    relationName: "CommentLikeToMember",
  }),
  sessions: helpers.many(memberSessions, {
    relationName: "MemberToMemberSession",
  }),
  chats: helpers.many(memberToChats, { relationName: "MemberToMemberToChat" }),
  messages: helpers.many(chatMessages, { relationName: "ChatMessageToMember" }),
  courses: helpers.many(memberToCourses, {
    relationName: "MemberToMemberToCourse",
  }),
  courseSectionProgresses: helpers.many(memberCourseSectionProgresses, {
    relationName: "MemberToMemberCourseSectionProgress",
  }),
  communityNotifications: helpers.many(communityNotifications, {
    relationName: "CommunityNotificationToMember",
  }),
}));
