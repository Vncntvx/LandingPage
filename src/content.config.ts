/**
 * @fileoverview Content Collections 配置
 * 使用 Astro Content Layer API 管理 i18n 翻译数据
 *
 * @module src/content.config
 * @requires astro:content
 * @requires astro/loaders
 * @since 1.0.0
 */

import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

/**
 * 导航项数据结构定义
 */
export interface NavItemSchema {
  label: string;
  href: string;
  hidden?: boolean;
}

const navItemSchema = z.object({
  label: z.string(),
  href: z.string(),
  hidden: z.boolean().optional(),
});

/**
 * 社交链接数据结构定义
 */
export interface SocialLinkSchema {
  icon: string;
  url: string;
  title: string;
}

const socialLinkSchema = z.object({
  icon: z.string(),
  url: z.string(),
  title: z.string(),
});

/**
 * 网站展示项数据结构定义
 */
export interface WebsiteItemSchema {
  id: string;
  title: string;
  image: string;
  url: string;
  description: string;
}

const websiteItemSchema = z.object({
  id: z.string(),
  title: z.string(),
  image: z.string(),
  url: z.string(),
  description: z.string(),
});

/**
 * 文章/博客项数据结构定义
 */
export interface PostItemSchema {
  id: string;
  title: string;
  image: string;
  url: string;
  description: string;
  pubDate?: string;
}

const postItemSchema = z.object({
  id: z.string(),
  title: z.string(),
  image: z.string(),
  url: z.string(),
  description: z.string(),
  pubDate: z.string().optional(), // ISO 8601 格式日期，用于排序
});

/**
 * RSS 配置数据结构定义
 */
export interface RssFeedSchema {
  url: string;
  parser: string;
}

export interface RssConfigSchema {
  enabled: boolean;
  feeds: RssFeedSchema[];
  limit: number;
}

const rssConfigSchema = z.object({
  enabled: z.boolean(),
  feeds: z.array(
    z.object({
      url: z.string(),
      parser: z.string(),
    })
  ),
  limit: z.number(),
});

/**
 * 时间线项数据结构定义
 */
export interface TimelineItemSchema {
  period: string;
  title: string;
  description: string;
}

const timelineItemSchema = z.object({
  period: z.string(),
  title: z.string(),
  description: z.string(),
});

/**
 * 价值观项数据结构定义
 */
export interface ValueItemSchema {
  label: string;
  text: string;
}

const valueItemSchema = z.object({
  label: z.string(),
  text: z.string(),
});

/**
 * 服务项数据结构定义
 */
export interface ServiceItemSchema {
  subtitle: string;
  title: string;
  description: string;
}

const serviceItemSchema = z.object({
  subtitle: z.string(),
  title: z.string(),
  description: z.string(),
});

/**
 * 联系卡片社交项数据结构定义
 */
export interface ContactSocialItemSchema {
  label: string;
  url: string;
  icon: string;
  handle: string;
}

const contactSocialItemSchema = z.object({
  label: z.string(),
  url: z.string(),
  icon: z.string(),
  handle: z.string(),
});

/**
 * 完整的 i18n 数据结构定义
 * 包含网站所有多语言内容的结构化定义
 */
export interface I18nSchema {
  site: {
    title: string;
    author: string;
    description: string;
    keywords: string;
    favicon: {
      ico: string;
      appleTouchIcon: string;
    };
  };
  nav: NavItemSchema[];
  header: {
    avatar: string;
    name: string;
  };
  hero: {
    subtitle: string;
    title: string;
    description: string;
  };
  websites: {
    title: string;
    items: WebsiteItemSchema[];
  };
  featuredPosts: {
    title: string;
    rss: RssConfigSchema;
    items: PostItemSchema[];
    seeAllText: string;
    seeAllUrl: string;
  };
  footer: {
    copyright: string;
    icp: {
      text: string;
      url: string;
    };
    mps: {
      text: string;
      url: string;
      logo: string;
    };
    socialLinks: SocialLinkSchema[];
  };
  about: {
    hero: {
      subtitle: string;
      title: string;
      description: string;
    };
    timeline: {
      subtitle: string;
      title: string;
      period: string;
      items: TimelineItemSchema[];
    };
    values: {
      subtitle: string;
      title: string;
      items: ValueItemSchema[];
      product: {
        subtitle: string;
        title: string;
        description: string;
        linkText: string;
        linkUrl: string;
      };
    };
    philosophy: {
      subtitle: string;
      title: string;
      description: string;
      ctaText: string;
      ctaUrl: string;
    };
  };
  contact: {
    hero: {
      subtitle: string;
      title: string;
      description: string;
    };
    cards: {
      email: {
        subtitle: string;
        address: string;
        note: string;
      };
      social: {
        subtitle: string;
        items: ContactSocialItemSchema[];
      };
    };
    form: {
      subtitle: string;
      title: string;
      note: string;
    };
    actions: {
      writeEmail: string;
      copy: string;
      copied: string;
    };
    formLabels: {
      name: string;
      email: string;
      topic: string;
      message: string;
    };
    formPlaceholders: {
      name: string;
      email: string;
      message: string;
    };
    formOptions: {
      consulting: string;
      content: string;
      share: string;
      other: string;
    };
    formSubmit: {
      default: string;
      sending: string;
      success: string;
      error: string;
    };
    services: {
      items: ServiceItemSchema[];
    };
  };
}

const i18nSchema = z.object({
  site: z.object({
    title: z.string(),
    author: z.string(),
    description: z.string(),
    keywords: z.string(),
    favicon: z.object({
      ico: z.string(),
      appleTouchIcon: z.string(),
    }),
  }),
  nav: z.array(navItemSchema),
  header: z.object({
    avatar: z.string(),
    name: z.string(),
  }),
  hero: z.object({
    subtitle: z.string(),
    title: z.string(),
    description: z.string(),
  }),
  websites: z.object({
    title: z.string(),
    items: z.array(websiteItemSchema),
  }),
  featuredPosts: z.object({
    title: z.string(),
    rss: rssConfigSchema,
    items: z.array(postItemSchema),
    seeAllText: z.string(),
    seeAllUrl: z.string(),
  }),
  footer: z.object({
    copyright: z.string(),
    icp: z.object({
      text: z.string(),
      url: z.string(),
    }),
    mps: z.object({
      text: z.string(),
      url: z.string(),
      logo: z.string(),
    }),
    socialLinks: z.array(socialLinkSchema),
  }),
  about: z.object({
    hero: z.object({
      subtitle: z.string(),
      title: z.string(),
      description: z.string(),
    }),
    timeline: z.object({
      subtitle: z.string(),
      title: z.string(),
      period: z.string(),
      items: z.array(timelineItemSchema),
    }),
    values: z.object({
      subtitle: z.string(),
      title: z.string(),
      items: z.array(valueItemSchema),
      product: z.object({
        subtitle: z.string(),
        title: z.string(),
        description: z.string(),
        linkText: z.string(),
        linkUrl: z.string(),
      }),
    }),
    philosophy: z.object({
      subtitle: z.string(),
      title: z.string(),
      description: z.string(),
      ctaText: z.string(),
      ctaUrl: z.string(),
    }),
  }),
  contact: z.object({
    hero: z.object({
      subtitle: z.string(),
      title: z.string(),
      description: z.string(),
    }),
    cards: z.object({
      email: z.object({
        subtitle: z.string(),
        address: z.string(),
        note: z.string(),
      }),
      social: z.object({
        subtitle: z.string(),
        items: z.array(contactSocialItemSchema),
      }),
    }),
    form: z.object({
      subtitle: z.string(),
      title: z.string(),
      note: z.string(),
    }),
    actions: z.object({
      writeEmail: z.string(),
      copy: z.string(),
      copied: z.string(),
    }),
    formLabels: z.object({
      name: z.string(),
      email: z.string(),
      topic: z.string(),
      message: z.string(),
    }),
    formPlaceholders: z.object({
      name: z.string(),
      email: z.string(),
      message: z.string(),
    }),
    formOptions: z.object({
      consulting: z.string(),
      content: z.string(),
      share: z.string(),
      other: z.string(),
    }),
    formSubmit: z.object({
      default: z.string(),
      sending: z.string(),
      success: z.string(),
      error: z.string(),
    }),
    services: z.object({
      items: z.array(serviceItemSchema),
    }),
  }),
});

/**
 * 定义 i18n 内容集合
 * 使用 glob 加载器从 i18n 目录加载所有 JSON 文件
 * 并应用 i18nSchema 进行数据验证
 */
const i18n = defineCollection({
  loader: glob({
    pattern: '**/*.json',
    base: './i18n',
  }),
  schema: i18nSchema,
});

/**
 * 导出所有内容集合配置
 */
export interface Collections {
  i18n: ReturnType<typeof defineCollection>;
}

export const collections: Collections = { i18n };
