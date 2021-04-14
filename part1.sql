--
-- Part 1 
--

-- Question 1

SELECT documents.id FROM documents
LEFT JOIN pages 
ON documents.id = pages.document_id
GROUP BY documents.id
HAVING count(pages.id) = 0;

-- Question 2

SELECT reports.title, count(pages.id) as totalpages FROM reports
LEFT JOIN documents ON reports.id = documents.report_id
LEFT JOIN pages ON documents.id = pages.document_id
GROUP BY reports.id
HAVING count(pages.id) > 0; -- This line is optional but was added according to the prompt: "reports which do not have pages may be ignored."

-- Question 3

/*

In order to implement comments on pages, documents, and reports I would create 
a new table called `comments`. This table will include a text column where the
user's comment would be stored. 

In addition to the `comments` table, I would also create 3 new association 
tables to create a connection between: the pages, documents, and reports and 
their associated comments. For example, these tables could be named 
page_comments, document_comments, report_comments.

It is necessary for pages, documents, and reports, respectively, to have 
one-to-many associations to their comments. In simple terms this means that 
a page, document, or report can have multiple comments, but a comment 
can only be associated to a single page, document, or report. I would also
create a unique index for the comment_id column for each association table.
This would make it impossible to associate a single comment with multiple 
pages, documents, or reports, this is needed to keep the data in the database
in a consistent state.

*/

-- Create statement for the comments table

CREATE TABLE "public"."comments" (
    "id" int4 NOT NULL DEFAULT nextval('comments_id_seq'::regclass),
    "comment" text,
    PRIMARY KEY ("id")
);

-- Create statement for each of the association tables

CREATE TABLE "public"."page_comments" (
    "id" int4 NOT NULL DEFAULT nextval('page_comment_id_seq'::regclass),
    "comment_id" int4 NOT NULL,
    "page_id" int4 NOT NULL,
    CONSTRAINT "page_comment_comment_id_fkey" FOREIGN KEY ("comment_id") REFERENCES "public"."comments"("id"),
    CONSTRAINT "page_comment_page_id_fkey" FOREIGN KEY ("page_id") REFERENCES "public"."pages"("id"),
    PRIMARY KEY ("id")
);

CREATE TABLE "public"."document_comments" (
    "id" int4 NOT NULL DEFAULT nextval('document_comments_id_seq'::regclass),
    "comment_id" int4 NOT NULL,
    "document_id" int4 NOT NULL,
    CONSTRAINT "document_comments_comment_id_fkey" FOREIGN KEY ("comment_id") REFERENCES "public"."comments"("id"),
    CONSTRAINT "document_comments_document_id_fkey" FOREIGN KEY ("document_id") REFERENCES "public"."documents"("id"),
    PRIMARY KEY ("id")
);

CREATE TABLE "public"."report_comments" (
    "id" int4 NOT NULL DEFAULT nextval('report_comments_id_seq'::regclass),
    "comment_id" int4,
    "report_id" int4,
    CONSTRAINT "report_comments_report_id_fkey" FOREIGN KEY ("report_id") REFERENCES "public"."reports"("id"),
    CONSTRAINT "report_comments_comment_id_fkey" FOREIGN KEY ("comment_id") REFERENCES "public"."comments"("id"),
    PRIMARY KEY ("id")
);
