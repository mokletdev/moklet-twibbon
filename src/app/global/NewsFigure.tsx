import { Tag } from "@prisma/client";
import Link from "next/link";

import { PostWithTagsAndUser } from "@/types/entityRelations";
import { stringifyDate } from "@/utils/atomics";

import Image from "./Image";

export function Tags({ tag }: Readonly<{ tag: Tag }>) {
  return (
    <Link
      key={tag.tagName}
      href={`/berita/tags/${tag.tagName}`}
      className="rounded-full bg-primary-50 text-primary-400 px-[18px] py-1.5 transition-all duration-500 hover:bg-primary-400 hover:text-primary-50"
    >
      <span className="text-sm">{tag.tagName}</span>
    </Link>
  );
}

export function NewsFigure({ post }: Readonly<{ post: PostWithTagsAndUser }>) {
  return (
    <figure className="w-full md:w-[31.2%]">
      <div className="h-[200px] w-full">
        <Image
          src={post.thumbnail}
          alt={post.slug}
          unoptimized
          height={200}
          width={372}
          className="h-full w-full object-cover rounded-[20px]"
        />
      </div>
      <div className="flex flex-col items-start justify-start gap-[26px]">
        <div>
          <div className="mb-[16px] mt-[26px] flex gap-[10px] flex-wrap">
            {post.tags.map((tag) => (
              <Tags tag={tag} key={tag.tagName} />
            ))}
          </div>
          <Link
            href={"/berita/" + post.slug}
            className="text-black hover:text-primary-400 transition-all duration-500"
          >
            <div className="min-h-[52px]">
              <span className="text-[18px] md:text-xl font-bold">
                {post.title.length > 52
                  ? post.title.slice(0, 48) + "..."
                  : post.title}
              </span>
            </div>
          </Link>
        </div>
        <div className="flex w-full justify-between">
          <div className="flex items-center gap-2">
            <Image
              src={post.user.user_pic}
              alt={post.user.name + "'s Pfp"}
              unoptimized
              height={28}
              width={28}
              className="h-7 w-7 object-cover rounded-full"
            />
            <span className="text-base text-black">{post.user.name}</span>
          </div>
          <span className="text-neutral-500">
            {post.published_at && stringifyDate(post.published_at)}
          </span>
        </div>
      </div>
    </figure>
  );
}
