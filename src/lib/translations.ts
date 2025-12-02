export type Language = 'en' | 'ja'

export const translations = {
  en: {
    // Header
    header: {
      title: 'Gallery - CS in English',
      gallery: 'Gallery',
      vote: 'Vote',
      logout: 'Logout',
      login: 'Login',
    },
    // Login Page
    login: {
      title: 'Gallery Login',
      description: 'Enter your nickname to continue',
      nicknameLabel: 'Nickname',
      nicknamePlaceholder: 'Display Name',
      submitButton: 'Login',
      submitting: 'Logging in...',
      unexpectedError: 'An unexpected error occurred',
    },
    // Submission Form
    submission: {
      pageTitle: 'Submit Your Work',
      cardTitle: 'Enter your URL',
      urlPlaceholder: 'Enter a URL for your work',
      locationLabel: 'Location',
      locationPlaceholder: 'Select your location',
      submitButton: 'Submit',
      updateButton: 'Update Submission',
      submitting: 'Submitting...',
      successMessage: 'Submission saved!',
      currentSubmission: 'Current Submission:',
      locationDisplay: 'Location:',
      successModalTitle: '🎉 Congratulations!',
      successModalMessage: 'Your work is complete!',
      successModalButton: 'Awesome!',
    },
    // Gallery
    gallery: {
      title: 'Gallery',
    },
    // Voting
    voting: {
      title: 'Voting Page',
      votes: 'Votes:',
      submitButton: 'Submit Votes',
      saving: 'Saving...',
      votesLabel: 'votes',
      maxVotesAlert: 'You can only vote for up to {max} submissions.',
      saveSuccessTitle: 'Success',
      saveSuccessMessage: 'Your votes have been saved successfully!',
      closeButton: 'Close',
    },
    // Admin
    admin: {
      title: 'Admin Dashboard',
      clearAllUsers: 'Clear All Users',
      clearAllSubmissions: 'Clear All Submissions',
      resetAllVotes: 'Reset All Votes',
      confirmTitle: 'Are you absolutely sure?',
      confirmClearUsers: 'This action cannot be undone. This will permanently delete all users, submissions, and votes from the database.',
      confirmClearSubmissions: 'This action cannot be undone. This will permanently delete all submissions and their associated votes from the database.',
      confirmResetVotes: 'This action cannot be undone. This will permanently delete all votes from the database.',
      cancel: 'Cancel',
      continue: 'Continue',
      tableRole: 'Role',
      tableNickname: 'Nickname',
      tableIpAddress: 'IP Address',
      tableSubmitted: 'Submitted',
      yes: 'Yes',
      no: 'No',
      // Alert messages
      votesResetSuccess: 'Votes reset successfully',
      votesResetError: 'Error resetting votes',
      submissionsClearedSuccess: 'All submissions cleared successfully',
      submissionsClearedError: 'Error clearing submissions',
      usersClearedSuccess: 'All users cleared successfully',
      usersClearedError: 'Error clearing users',
    },
    // Errors (for server actions)
    errors: {
      nicknameRequired: 'Nickname is required',
      invalidNickname: 'Invalid nickname',
      deviceIdRequired: 'Device ID is required. Please enable JavaScript and cookies.',
      databaseError: 'Database error during login',
      unauthorized: 'Unauthorized',
      urlRequired: 'URL is required',
      locationRequired: 'Location is required',
      invalidLocation: 'Invalid location',
      urlMustContain: 'URL must contain "{text}"',
      failedToSubmit: 'Failed to submit',
      maxVotesAllowed: 'Max {max} votes allowed',
      failedToSaveVotes: 'Failed to save votes',
      failedToResetVotes: 'Failed to reset votes',
      failedToClearSubmissions: 'Failed to clear all submissions',
      failedToClearUsers: 'Failed to clear all users',
    },
    // Language toggle
    language: {
      toggle: 'EN / 日本語',
      english: 'EN',
      japanese: '日本語',
    },
  },
  ja: {
    // Header
    header: {
      title: 'ギャラリー - CS in English',
      gallery: 'ギャラリー',
      vote: '投票',
      logout: 'ログアウト',
      login: 'ログイン',
    },
    // Login Page
    login: {
      title: 'ギャラリー ログイン',
      description: 'ニックネームを入力してください',
      nicknameLabel: 'ニックネーム',
      nicknamePlaceholder: '表示名',
      submitButton: 'ログイン',
      submitting: 'ログイン中...',
      unexpectedError: '予期しないエラーが発生しました',
    },
    // Submission Form
    submission: {
      pageTitle: '作品を提出',
      cardTitle: 'URLを入力',
      urlPlaceholder: '作品のURLを入力してください',
      locationLabel: '場所',
      locationPlaceholder: '場所を選択',
      submitButton: '提出',
      updateButton: '提出を更新',
      submitting: '提出中...',
      successMessage: '提出が保存されました！',
      currentSubmission: '現在の提出:',
      locationDisplay: '場所:',
      successModalTitle: '🎉 作品完成、おめでとう！',
      successModalMessage: 'すばらしい作品ができましたね！',
      successModalButton: 'やったー！',
    },
    // Gallery
    gallery: {
      title: 'ギャラリー',
    },
    // Voting
    voting: {
      title: '投票ページ',
      votes: '投票数:',
      submitButton: '投票を確定',
      saving: '保存中...',
      votesLabel: '票',
      maxVotesAlert: '最大{max}件まで投票できます。',
      saveSuccessTitle: '成功',
      saveSuccessMessage: '投票が正常に保存されました！',
      closeButton: '閉じる',
    },
    // Admin
    admin: {
      title: '管理ダッシュボード',
      clearAllUsers: '全ユーザーを削除',
      clearAllSubmissions: '全提出を削除',
      resetAllVotes: '全投票をリセット',
      confirmTitle: '本当によろしいですか？',
      confirmClearUsers: 'この操作は取り消せません。すべてのユーザー、提出、投票がデータベースから完全に削除されます。',
      confirmClearSubmissions: 'この操作は取り消せません。すべての提出とそれに関連する投票がデータベースから完全に削除されます。',
      confirmResetVotes: 'この操作は取り消せません。すべての投票がデータベースから完全に削除されます。',
      cancel: 'キャンセル',
      continue: '続行',
      tableRole: '役割',
      tableNickname: 'ニックネーム',
      tableIpAddress: 'IPアドレス',
      tableSubmitted: '提出済み',
      yes: 'はい',
      no: 'いいえ',
      // Alert messages
      votesResetSuccess: '投票がリセットされました',
      votesResetError: '投票のリセットに失敗しました',
      submissionsClearedSuccess: 'すべての提出が削除されました',
      submissionsClearedError: '提出の削除に失敗しました',
      usersClearedSuccess: 'すべてのユーザーが削除されました',
      usersClearedError: 'ユーザーの削除に失敗しました',
    },
    // Errors (for server actions)
    errors: {
      nicknameRequired: 'ニックネームは必須です',
      invalidNickname: '無効なニックネームです',
      deviceIdRequired: 'デバイスIDが必要です。JavaScriptとCookieを有効にしてください。',
      databaseError: 'ログイン中にデータベースエラーが発生しました',
      unauthorized: '権限がありません',
      urlRequired: 'URLは必須です',
      locationRequired: '場所は必須です',
      invalidLocation: '無効な場所です',
      urlMustContain: 'URLには「{text}」を含める必要があります',
      failedToSubmit: '提出に失敗しました',
      maxVotesAllowed: '最大{max}票まで投票できます',
      failedToSaveVotes: '投票の保存に失敗しました',
      failedToResetVotes: '投票のリセットに失敗しました',
      failedToClearSubmissions: '提出の削除に失敗しました',
      failedToClearUsers: 'ユーザーの削除に失敗しました',
    },
    // Language toggle
    language: {
      toggle: 'EN / 日本語',
      english: 'EN',
      japanese: '日本語',
    },
  },
}

// Define the structure type based on English translations
type TranslationStructure = {
  header: {
    title: string
    gallery: string
    vote: string
    logout: string
    login: string
  }
  login: {
    title: string
    description: string
    nicknameLabel: string
    nicknamePlaceholder: string
    submitButton: string
    submitting: string
    unexpectedError: string
  }
  submission: {
    pageTitle: string
    cardTitle: string
    urlPlaceholder: string
    locationLabel: string
    locationPlaceholder: string
    submitButton: string
    updateButton: string
    submitting: string
    successMessage: string
    currentSubmission: string
    locationDisplay: string
    successModalTitle: string
    successModalMessage: string
    successModalButton: string
  }
  gallery: {
    title: string
  }
  voting: {
    title: string
    votes: string
    submitButton: string
    saving: string
    votesLabel: string
    maxVotesAlert: string
    saveSuccessTitle: string
    saveSuccessMessage: string
    closeButton: string
  }
  admin: {
    title: string
    clearAllUsers: string
    clearAllSubmissions: string
    resetAllVotes: string
    confirmTitle: string
    confirmClearUsers: string
    confirmClearSubmissions: string
    confirmResetVotes: string
    cancel: string
    continue: string
    tableRole: string
    tableNickname: string
    tableIpAddress: string
    tableSubmitted: string
    yes: string
    no: string
    votesResetSuccess: string
    votesResetError: string
    submissionsClearedSuccess: string
    submissionsClearedError: string
    usersClearedSuccess: string
    usersClearedError: string
  }
  errors: {
    nicknameRequired: string
    invalidNickname: string
    deviceIdRequired: string
    databaseError: string
    unauthorized: string
    urlRequired: string
    locationRequired: string
    invalidLocation: string
    urlMustContain: string
    failedToSubmit: string
    maxVotesAllowed: string
    failedToSaveVotes: string
    failedToResetVotes: string
    failedToClearSubmissions: string
    failedToClearUsers: string
  }
  language: {
    toggle: string
    english: string
    japanese: string
  }
}

export type TranslationKeys = TranslationStructure

export function getTranslations(lang: Language): TranslationKeys {
  return translations[lang]
}

// Helper to get error message with placeholder replacement
export function formatMessage(message: string, replacements: Record<string, string | number>): string {
  let result = message
  for (const [key, value] of Object.entries(replacements)) {
    result = result.replace(`{${key}}`, String(value))
  }
  return result
}

