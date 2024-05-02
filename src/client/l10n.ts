import type { Translations } from '@cord-sdk/types';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

export const LANGS = ['en', 'fr', 'he'] as const;
export type Language = (typeof LANGS)[number];

const resources = {
  en: {
    translation: {
      name: 'Clack',
      today: 'Today',
      replies_one: '1 reply',
      replies_other: '{{count}} replies',
      thread_header: 'Thread',
      loading_messages: 'Loading messages...',
      add_channels: 'Add channels',
      add_direct_message: 'New direct message',
      pinned_threads_one: '1 Pinned',
      pinned_threads_other: '{{count}} Pinned',
      last_reply: 'Last reply <timestamp>',
    },
  },
  fr: {
    translation: {
      name: 'Claque',
      today: "Aujourd'hui",
      replies_one: '1 réponse',
      replies_other: '{{count}} réponses',
      thread_header: 'Fil de discussion',
      loading_messages: 'Chargement en cours...',
      add_channels: 'Ajouter des chaînes',
      add_direct_message: 'Nouveau message direct',
      pinned_threads_one: '1 épinglé',
      pinned_threads_other: '{{count}} épinglés',
      last_reply: 'Dernière réponse <timestamp>',
    },
  },
  he: {
    translation: {
      name: 'קלאק',
      today: 'היום',
      replies_one: 'תגובה אחת',
      replies_two: '{{count}} תגובות',
      replies_other: '{{count}} תגובות',
      thread_header: 'שרשור',
      loading_messages: 'טוען הודעות...',
      add_channels: 'הוסף ערוצים',
      add_direct_message: 'הודעה ישירה חדשה',
      pinned_threads_one: '1 מוצמד',
      pinned_threads_two: '{{count}} מוצמדים',
      pinned_threads_other: '{{count}} מוצמדים',
      last_reply: 'תשובה אחרונה <timestamp>',
    },
  },
} as const;

void i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false, // react already safes from xss => https://www.i18next.com/translation-function/interpolation#unescape
    },
  });

// This tells i18next what shape the resources file is, which then feeds into
// the TypeScript types in a very clever way so that when you ask for a
// translation key, it can check that you're using a key that exists.
declare module 'i18next' {
  export interface CustomTypeOptions {
    resources: (typeof resources)['en'];
  }
}

export function getCordTranslations(channel: string): Translations {
  return {
    en: {
      composer: {
        send_message_placeholder: `Message #${channel}`,
      },
      notification_templates: {
        cord: {
          thread_create:
            '<user>{{senders.0.displayName}}</user> sent you a direct message',
        },
      },
    },
    fr: {
      composer: {
        send_message_placeholder: `Message #${channel}`,
        reply_placeholder: 'Répondre...',
        mention_someone_tooltip: "Mentionner quelqu'un",
        annotate_action: 'Annoter',
        replace_annotation_tooltip: "Remplacer l'annotation",
        add_emoji_tooltip: 'Ajouter un emoji',
        remove_task_tooltip: 'Supprimer la tâche',
        create_task_tooltip: 'Créer une tâche',
        attach_file_tooltip: 'Joindre un fichier',
        remove_file_action: 'Supprimer',
        connect_to_slack_action: 'Connecter votre équipe Slack',
        slack_follow_instructions: 'Suivre les instructions',
        editing_status: 'Édition en cours',
        cancel_editing_action: 'Annuler',
        resolved_status: 'Résolu',
        unresolve_action: 'Rouvrir pour répondre',
        annotation: 'Votre annotation',
        remove_annotation_action: 'Supprimer',
        send_message_action_failure:
          "Échec de l'envoi du message. Veuillez réessayer.",
        drag_and_drop_files_tooltip: 'Déposer des fichiers',
      },
      thread: {
        placeholder_title: 'Discutez avec votre équipe, ici même',
        placeholder_body:
          "Posez une question, donnez un retour, ou dites simplement 'Bonjour'. Les commentaires peuvent être vus par quiconque peut accéder à cette page.",
        new_status: 'Nouveau',
        reply_action: 'Répondre...',
        new_replies_status_other: '{{count}} non lus',
        replies_status_one: '1 réponse',
        replies_status_other: '{{count}} réponses',
        mark_as_read_action: 'Marquer comme lu',
        share_via_slack_action: 'Partager avec Slack',
        share_via_slack_channel_action:
          'Partager dans le canal #{{slackChannel}}',
        share_via_slack_action_not_connected: 'Connectez-vous pour partager',
        share_via_slack_action_success: 'Partagé dans #{{slackChannel}}',
        share_via_slack_channel_placeholder: 'Tapez ou sélectionnez',
        share_via_slack_no_channels: 'Aucun canal public trouvé',
        share_via_email_action: 'Partager par e-mail',
        share_via_email_screenshot_warning:
          "Une capture d'écran de cette page sera incluse dans l'e-mail.",
        share_via_email_placeholder: 'email@email.com',
        subscribe_action: "S'abonner",
        subscribe_action_success: 'Vous êtes abonné à cette discussion',
        unsubscribe_action: 'Se désabonner',
        unsubscribe_action_success:
          'Vous vous êtes désabonné de cette discussion',
        resolve_action: 'Résoudre',
        resolve_action_success: 'Vous avez résolu cette discussion',
        resolved_status: 'Résolu',
        unresolve_action: 'Rouvrir',
        unresolve_action_success: 'Vous avez rouvert cette discussion',
        collapse_action: 'Réduire la discussion',
        typing_users_status: "En train d'écrire",
      },
      message: {
        download_action: 'Télécharger',
        unable_to_display_document: "Impossible d'afficher le document",
        unable_to_display_image: "Impossible d'afficher l'image",
        editing_status: '(Édition)',
        edited_status: '(Modifié)',
        edit_action: 'Modifier',
        edit_resolved_action: 'Rouvrir pour modifier',
        delete_action: 'Supprimer',
        deleted_message: '{{user.displayName}} a supprimé un message',
        deleted_messages_one: '{{user.displayName}} a supprimé un message',
        deleted_messages_other:
          '{{user.displayName}} a supprimé {{count}} messages',
        sent_via_slack_tooltip: 'Envoyé via Slack',
        sent_via_email_tooltip: 'Envoyé par e-mail',
        undo_delete_action: 'Annuler la suppression',
        add_reaction_action: 'Ajouter une réaction',
        show_more_other: 'Afficher {{count}} de plus',
        message_options_tooltip: 'Options',
        screenshot_loading_status: 'Chargement',
        screenshot_missing_status: "Aucune capture d'écran trouvée",
        screenshot_expand_action: 'Image',
        screenshot_expand_tooltip: 'Cliquez pour agrandir',
        seen_by_status: 'Vu par {{users, list(style: short)}}',
        seen_by_status_overflow_one:
          'Vu par {{users, list(style: narrow)}}, et 1 autre',
        seen_by_status_overflow_other:
          'Vu par {{users, list(style: narrow)}}, et {{count}} autres',
        image_modal_copy_link_action: 'Lien',
        image_modal_copy_link_toolitp: 'Cliquez pour copier',
        image_modal_copy_link_success: 'Copié dans le presse-papiers',
        image_modal_blurred_status:
          'Le contenu potentiellement confidentiel a été flouté',
        image_modal_annotation_header:
          '{{user.displayName}} a annoté ceci <datespan>le {{date}}</datespan>',
        image_modal_attachment_header:
          '{{user.displayName}} a joint ceci <datespan>le {{date}}</datespan>',
        image_modal_header_date_format: 'D MMM [à] h:mm A',
        timestamp: {
          in_less_than_a_minute: "en moins d'une minute",
          just_now: "à l'instant",
          in_minutes_one: 'dans 1 min',
          in_minutes_other: 'dans {{count}} mins',
          minutes_ago_one: 'il y a 1 min',
          minutes_ago_other: 'il y a {{count}} mins',
          in_hours_one: 'dans 1 heure',
          in_hours_other: 'dans {{count}} heures',
          hours_ago_one: 'il y a 1 heure',
          hours_ago_other: 'il y a {{count}} heures',
          yesterday_format: '[hier]',
          last_week_format: 'dddd',
          tomorrow_format: '[demain]',
          next_week_format: 'dddd',
          this_year_format: 'D MMM',
          other_format: 'D MMM YYYY',
        },
        absolute_timestamp: {
          today_format: 'h:mm A',
          yesterday_format: 'D MMM',
          last_week_format: 'D MMM',
          tomorrow_format: 'D MMM',
          next_week_format: 'D MMM',
          this_year_format: 'D MMM',
          other_format: 'D MMM YYYY',
        },
      },
      notifications: {
        notifications_title: 'Notifications',
        mark_all_as_read_action: 'Tout marquer comme lu',
        mark_as_read_action: 'Marquer comme lu',
        delete_action: 'Supprimer la notification',
        empty_state_title: 'Vous êtes à jour',
        empty_state_body:
          "Lorsque quelqu'un vous mentionne ou répond à vos commentaires, nous vous le ferons savoir ici.",
        notification_options_tooltip: 'Options',
        timestamp: {
          in_less_than_a_minute: "En moins d'une minute",
          just_now: "À l'instant",
          in_minutes_one: 'Dans 1 min',
          in_minutes_other: 'Dans {{count}} mins',
          minutes_ago_one: 'Il y a 1 min',
          minutes_ago_other: 'Il y a {{count}} mins',
          in_hours_one: 'Dans 1 heure',
          in_hours_other: 'Dans {{count}} heures',
          hours_ago_one: 'Il y a 1 heure',
          hours_ago_other: 'Il y a {{count}} heures',
          yesterday_format: '[Hier à] H:mma',
          last_week_format: 'dddd',
          tomorrow_format: '[Demain à] H:mma',
          next_week_format: 'dddd',
          this_year_format: 'MMM D, YYYY',
          other_format: 'MMM D, YYYY',
        },
      },
      notification_templates: {
        cord: {
          thread_create:
            '<user>{{senders.0.displayName}}</user> vous a envoyé un message direct',
        },
      },
    },
    he: {
      composer: {
        send_message_placeholder: `#${channel} הוסף תגובה`,
        reply_placeholder: 'תגובה...',
        mention_someone_tooltip: 'הזכר איש',
        annotate_action: 'הערה',
        replace_annotation_tooltip: 'החלף הערה',
        add_emoji_tooltip: 'הוסף אימוגי',
        remove_task_tooltip: 'הסר משימה',
        create_task_tooltip: 'צור משימה',
        attach_file_tooltip: 'צרף קובץ',
        remove_file_action: 'הסר',
        connect_to_slack_action: 'התחבר לצוות ה-Slack שלך',
        slack_follow_instructions: 'עקוב אחר ההוראות',
        editing_status: 'עריכה',
        cancel_editing_action: 'ביטול',
        resolved_status: 'פתר',
        unresolve_action: 'פתח מחדש לתשובה',
        annotation: 'ההערה שלך',
        remove_annotation_action: 'הסר',
        send_message_action_failure: 'נכשל בשליחת ההודעה. נא לנסות שוב.',
        drag_and_drop_files_tooltip: 'גרור קבצים',
      },
      thread: {
        placeholder_title: 'שוחח עם הצוות שלך, כאן',
        placeholder_body:
          'שאל שאלה, תן משוב, או פשוט אמור "היי". התגובות יכולות להיראות על ידי כל אחד שיכול לגשת לדף זה.',
        new_status: 'חדש',
        reply_action: 'תגובה...',
        new_replies_status_one: '{{count}} שאלות שלא נקראו',
        new_replies_status_two: '{{count}} שאלות שלא נקראו',
        new_replies_status_other: '{{count}} שאלות שלא נקראו',
        replies_status_one: '1 תגובה',
        replies_status_two: '{{count}} תגובות',
        replies_status_other: '{{count}} תגובות',
        mark_as_read_action: 'סמן כנקרא',
        share_via_slack_action: 'שתף עם Slack',
        share_via_slack_channel_action: 'שתף אל #{{slackChannel}}',
        share_via_slack_action_not_connected: 'התחבר כדי לשתף',
        share_via_slack_action_success: 'שותף אל #{{slackChannel}}',
        share_via_slack_channel_placeholder: 'הקלד או בחר',
        share_via_slack_no_channels: 'לא נמצאו ערוצים ציבוריים',
        share_via_email_action: 'שתף באמצעות אימייל',
        share_via_email_screenshot_warning: 'צילום מסך של דף זה יכלל באימייל.',
        share_via_email_placeholder: 'אימייל@אימייל.com',
        subscribe_action: 'הרשם',
        subscribe_action_success: 'נרשמת לאשכול זה',
        unsubscribe_action: 'בטל הרשמה',
        unsubscribe_action_success: 'ביטלת הרשמה מהאשכול הזה',
        resolve_action: 'פתור',
        resolve_action_success: 'פתרת את האשכול הזה',
        resolved_status: 'פתור',
        unresolve_action: 'פתח מחדש',
        unresolve_action_success: 'פתחת מחדש את האשכול הזה',
        collapse_action: 'כווץ את האשכול',
        typing_users_status: 'מקליד',
      },
      message: {
        download_action: 'הורדה',
        unable_to_display_document: 'לא ניתן להציג מסמך',
        unable_to_display_image: 'לא ניתן להציג תמונה',
        editing_status: '(עריכה)',
        edited_status: '(נערך)',
        edit_action: 'עריכה',
        edit_resolved_action: 'פתח עריכה מחדש',
        delete_action: 'מחיקה',
        deleted_message: '{{user.displayName}} מחק הודעה',
        deleted_messages_one: '{{user.displayName}} מחק הודעה',
        deleted_messages_two: '{{user.displayName}} מחק {{count}} הודעות',
        deleted_messages_other: '{{user.displayName}} מחק {{count}} הודעות',
        sent_via_slack_tooltip: 'נשלח דרך Slack',
        sent_via_email_tooltip: 'נשלח דרך אימייל',
        undo_delete_action: 'בטל',
        add_reaction_action: 'הוסף תגובה',
        show_more_one: 'הצג {{count}} נוספים',
        show_more_two: 'הצג {{count}} נוספים',
        show_more_other: 'הצג {{count}} נוספים',
        message_options_tooltip: 'אפשרויות',
        screenshot_loading_status: 'טוען',
        screenshot_missing_status: 'לא נמצאה תמונה',
        screenshot_expand_action: 'תמונה',
        screenshot_expand_tooltip: 'לחץ כדי להרחיב',
        seen_by_status: 'נצפה על ידי {{users, list(style: short)}}',
        seen_by_status_overflow_one:
          'נצפה על ידי {{users, list(style: narrow)}}, ועוד 1',
        seen_by_status_overflow_two:
          'נצפה על ידי {{users, list(style: narrow)}}, ועוד {{count}}',
        seen_by_status_overflow_other:
          'נצפה על ידי {{users, list(style: narrow)}}, ועוד {{count}}',
        image_modal_copy_link_action: 'קישור',
        image_modal_copy_link_toolitp: 'לחץ כדי להעתיק',
        image_modal_copy_link_success: 'הועתק ללוח',
        image_modal_blurred_status: 'התוכן המכיל עשוי להיות סודי ונמחק',
        image_modal_annotation_header:
          '{{user.displayName}} הוסיף הערה <datespan>בתאריך {{date}}</datespan>',
        image_modal_attachment_header:
          '{{user.displayName}} הוסיף קובץ מצורף <datespan>בתאריך {{date}}</datespan>',
        image_modal_header_date_format: 'D MMM [at] h:mm A',
        timestamp: {
          in_less_than_a_minute: 'בפחות מדקה',
          just_now: 'כעת',
          in_minutes_one: 'בדקה',
          in_minutes_two: 'ב{{count}} דקות',
          in_minutes_other: 'ב{{count}} דקות',
          minutes_ago_one: 'לפני דקה',
          minutes_ago_two: 'לפני {{count}} דקות',
          minutes_ago_other: 'לפני {{count}} דקות',
          in_hours_one: 'בשעה',
          in_hours_two: 'ב{{count}} שעות',
          in_hours_other: 'ב{{count}} שעות',
          hours_ago_one: 'לפני שעה',
          hours_ago_two: 'לפני {{count}} שעות',
          hours_ago_other: 'לפני {{count}} שעות',
          yesterday_format: '[אתמול]',
          last_week_format: 'dddd',
          tomorrow_format: '[מחר]',
          next_week_format: 'dddd',
          this_year_format: 'MMM D',
          other_format: 'D MMM, YYYY',
        },
        absolute_timestamp: {
          today_format: 'h:mm A',
          yesterday_format: 'D MMM',
          last_week_format: 'D MMM',
          tomorrow_format: 'D MMM',
          next_week_format: 'D MMM',
          this_year_format: 'D MMM',
          other_format: 'D MMM, YYYY',
        },
      },
      notifications: {
        notifications_title: 'התראות',
        mark_all_as_read_action: 'סמן הכול כנקרא',
        mark_as_read_action: 'סמן כנקרא',
        delete_action: 'מחק התראה',
        empty_state_title: 'אתה מעודכן לחלוטין',
        empty_state_body:
          'כאשר מישהו מזכיר אותך ב-@ או מגיב לתגובות שלך, נודיע לך כאן.',
        notification_options_tooltip: 'אפשרויות',
        timestamp: {
          in_less_than_a_minute: 'בפחות מדקה',
          just_now: 'כעת',
          in_minutes_one: 'בדקה',
          in_minutes_two: 'ב{{count}} דקות',
          in_minutes_other: 'ב{{count}} דקות',
          minutes_ago_one: 'לפני דקה',
          minutes_ago_two: 'לפני {{count}} דקות',
          minutes_ago_other: 'לפני {{count}} דקות',
          in_hours_one: 'בשעה',
          in_hours_two: 'ב{{count}} שעות',
          in_hours_other: 'ב{{count}} שעות',
          hours_ago_one: 'לפני שעה',
          hours_ago_two: 'לפני {{count}} שעות',
          hours_ago_other: 'לפני {{count}} שעות',
          yesterday_format: '[אתמול בשעה] h:mma',
          last_week_format: 'dddd',
          tomorrow_format: '[מחר בשעה] h:mma',
          next_week_format: 'dddd',
          this_year_format: 'D MMM, YYYY',
          other_format: 'D MMM, YYYY',
        },
      },
      notification_templates: {
        cord: {
          thread_create:
            '<user>{{senders.0.displayName}}</user> שלח לך הודעה ישירה',
        },
      },
    },
  } as Translations;
}
