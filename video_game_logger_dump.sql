PGDMP  '                    }           video_game_logger    17.2    17.2                0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                           false                       0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                           false                       0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                           false                       1262    16388    video_game_logger    DATABASE     s   CREATE DATABASE video_game_logger WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'C';
 !   DROP DATABASE video_game_logger;
                     postgres    false            �            1259    16474    video_game_reviews    TABLE     z  CREATE TABLE public.video_game_reviews (
    id integer NOT NULL,
    game_name character varying(50) NOT NULL,
    review_text character varying(2500) NOT NULL,
    rating integer NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    game_cover text,
    CONSTRAINT video_game_reviews_rating_check CHECK ((rating = ANY (ARRAY[1, 2, 3, 4, 5])))
);
 &   DROP TABLE public.video_game_reviews;
       public         heap r       postgres    false            �            1259    16473    video_game_reviews_id_seq    SEQUENCE     �   CREATE SEQUENCE public.video_game_reviews_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 0   DROP SEQUENCE public.video_game_reviews_id_seq;
       public               postgres    false    218                       0    0    video_game_reviews_id_seq    SEQUENCE OWNED BY     W   ALTER SEQUENCE public.video_game_reviews_id_seq OWNED BY public.video_game_reviews.id;
          public               postgres    false    217            z           2604    16477    video_game_reviews id    DEFAULT     ~   ALTER TABLE ONLY public.video_game_reviews ALTER COLUMN id SET DEFAULT nextval('public.video_game_reviews_id_seq'::regclass);
 D   ALTER TABLE public.video_game_reviews ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    217    218    218                      0    16474    video_game_reviews 
   TABLE DATA           h   COPY public.video_game_reviews (id, game_name, review_text, rating, created_at, game_cover) FROM stdin;
    public               postgres    false    218   �                  0    0    video_game_reviews_id_seq    SEQUENCE SET     H   SELECT pg_catalog.setval('public.video_game_reviews_id_seq', 61, true);
          public               postgres    false    217            ~           2606    16483 *   video_game_reviews video_game_reviews_pkey 
   CONSTRAINT     h   ALTER TABLE ONLY public.video_game_reviews
    ADD CONSTRAINT video_game_reviews_pkey PRIMARY KEY (id);
 T   ALTER TABLE ONLY public.video_game_reviews DROP CONSTRAINT video_game_reviews_pkey;
       public                 postgres    false    218                  x������ � �     