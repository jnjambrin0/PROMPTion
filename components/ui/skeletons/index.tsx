// ============================================================================
// SKELETON SYSTEM - Exportaciones centralizadas
// ============================================================================

// Base skeleton components
export { 
  Skeleton, 
  SkeletonText, 
  SkeletonAvatar, 
  SkeletonButton 
} from "../skeleton"

// Base reusable skeletons
export {
  SkeletonCard,
  SkeletonList,
  SkeletonListItem,
  SkeletonStat,
  SkeletonStatsGrid,
  SkeletonNavItem,
  SkeletonNavigation,
  SkeletonSearchAndFilters,
  SkeletonUserProfile,
  SkeletonGrid
} from "./base-skeletons"

// Layout skeletons
export {
  SidebarSkeleton,
  RightSidebarSkeleton,
  MobileNavSkeleton,
  PageHeaderSkeleton,
  TabNavigationSkeleton
} from "./layout-skeletons"

// Page-specific skeletons
export {
  DashboardSkeleton,
  HomeSkeleton,
  ProfileSkeleton,
  NotificationsSkeleton,
  TemplatesSkeleton,
  SettingsSkeleton
} from "./page-skeletons"

// Workspace-specific skeletons
export {
  WorkspaceSkeleton,
  WorkspaceOverviewSkeleton,
  WorkspacePromptsSkeleton,
  WorkspaceCategoriesSkeleton,
  WorkspaceMembersSkeleton,
  WorkspaceSettingsSkeleton,
  PromptPageSkeleton,
  PromptEditSkeleton,
  PromptSettingsSkeleton
} from "./workspace-skeletons" 