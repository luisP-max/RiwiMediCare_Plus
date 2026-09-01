--
-- PostgreSQL database dump
--

\restrict o4QHy8EJFBJ7fqRFgjF7FOdCJo4ol17nZh77LFyNMRtKsz424LjDaeaKVVeklnc

-- Dumped from database version 15.19
-- Dumped by pg_dump version 16.14 (Ubuntu 16.14-1.pgdg24.04+1)

-- Started on 2026-08-31 17:47:47 -05

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 848 (class 1247 OID 17925)
-- Name: enum_clinics_status; Type: TYPE; Schema: public; Owner: luis
--

CREATE TYPE public.enum_clinics_status AS ENUM (
    'active',
    'deleted'
);


ALTER TYPE public.enum_clinics_status OWNER TO luis;

--
-- TOC entry 860 (class 1247 OID 17954)
-- Name: enum_medicines_status; Type: TYPE; Schema: public; Owner: luis
--

CREATE TYPE public.enum_medicines_status AS ENUM (
    'active',
    'deleted'
);


ALTER TYPE public.enum_medicines_status OWNER TO luis;

--
-- TOC entry 866 (class 1247 OID 17968)
-- Name: enum_requests_status; Type: TYPE; Schema: public; Owner: luis
--

CREATE TYPE public.enum_requests_status AS ENUM (
    'Pending',
    'Approved',
    'Rejected'
);


ALTER TYPE public.enum_requests_status OWNER TO luis;

--
-- TOC entry 842 (class 1247 OID 17911)
-- Name: enum_users_role; Type: TYPE; Schema: public; Owner: luis
--

CREATE TYPE public.enum_users_role AS ENUM (
    'Administrator',
    'Request Manager'
);


ALTER TYPE public.enum_users_role OWNER TO luis;

--
-- TOC entry 854 (class 1247 OID 17940)
-- Name: enum_warehouses_status; Type: TYPE; Schema: public; Owner: luis
--

CREATE TYPE public.enum_warehouses_status AS ENUM (
    'active',
    'deleted'
);


ALTER TYPE public.enum_warehouses_status OWNER TO luis;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 215 (class 1259 OID 17929)
-- Name: clinics; Type: TABLE; Schema: public; Owner: luis
--

CREATE TABLE public.clinics (
    id uuid NOT NULL,
    nit character varying(50) NOT NULL,
    name character varying(150) NOT NULL,
    address character varying(255) NOT NULL,
    manager_name character varying(100) NOT NULL,
    status public.enum_clinics_status DEFAULT 'active'::public.enum_clinics_status NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


ALTER TABLE public.clinics OWNER TO luis;

--
-- TOC entry 217 (class 1259 OID 17959)
-- Name: medicines; Type: TABLE; Schema: public; Owner: luis
--

CREATE TABLE public.medicines (
    id uuid NOT NULL,
    name character varying(150) NOT NULL,
    description character varying(255) NOT NULL,
    status public.enum_medicines_status DEFAULT 'active'::public.enum_medicines_status NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


ALTER TABLE public.medicines OWNER TO luis;

--
-- TOC entry 218 (class 1259 OID 17975)
-- Name: requests; Type: TABLE; Schema: public; Owner: luis
--

CREATE TABLE public.requests (
    id uuid NOT NULL,
    clinic_id uuid NOT NULL,
    medicine_id uuid NOT NULL,
    warehouse_id uuid NOT NULL,
    requested_quantity integer NOT NULL,
    status public.enum_requests_status DEFAULT 'Pending'::public.enum_requests_status NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


ALTER TABLE public.requests OWNER TO luis;

--
-- TOC entry 214 (class 1259 OID 17915)
-- Name: users; Type: TABLE; Schema: public; Owner: luis
--

CREATE TABLE public.users (
    id uuid NOT NULL,
    name character varying(100) NOT NULL,
    email character varying(150) NOT NULL,
    password character varying(255) NOT NULL,
    role public.enum_users_role NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


ALTER TABLE public.users OWNER TO luis;

--
-- TOC entry 219 (class 1259 OID 17996)
-- Name: warehouse_stocks; Type: TABLE; Schema: public; Owner: luis
--

CREATE TABLE public.warehouse_stocks (
    id uuid NOT NULL,
    warehouse_id uuid NOT NULL,
    medicine_id uuid NOT NULL,
    available_quantity integer DEFAULT 1000 NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


ALTER TABLE public.warehouse_stocks OWNER TO luis;

--
-- TOC entry 216 (class 1259 OID 17945)
-- Name: warehouses; Type: TABLE; Schema: public; Owner: luis
--

CREATE TABLE public.warehouses (
    id uuid NOT NULL,
    name character varying(100) NOT NULL,
    location character varying(255) NOT NULL,
    status public.enum_warehouses_status DEFAULT 'active'::public.enum_warehouses_status NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


ALTER TABLE public.warehouses OWNER TO luis;

--
-- TOC entry 3504 (class 0 OID 17929)
-- Dependencies: 215
-- Data for Name: clinics; Type: TABLE DATA; Schema: public; Owner: luis
--

COPY public.clinics (id, nit, name, address, manager_name, status, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 3506 (class 0 OID 17959)
-- Dependencies: 217
-- Data for Name: medicines; Type: TABLE DATA; Schema: public; Owner: luis
--

COPY public.medicines (id, name, description, status, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 3507 (class 0 OID 17975)
-- Dependencies: 218
-- Data for Name: requests; Type: TABLE DATA; Schema: public; Owner: luis
--

COPY public.requests (id, clinic_id, medicine_id, warehouse_id, requested_quantity, status, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 3503 (class 0 OID 17915)
-- Dependencies: 214
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: luis
--

COPY public.users (id, name, email, password, role, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 3508 (class 0 OID 17996)
-- Dependencies: 219
-- Data for Name: warehouse_stocks; Type: TABLE DATA; Schema: public; Owner: luis
--

COPY public.warehouse_stocks (id, warehouse_id, medicine_id, available_quantity, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 3505 (class 0 OID 17945)
-- Dependencies: 216
-- Data for Name: warehouses; Type: TABLE DATA; Schema: public; Owner: luis
--

COPY public.warehouses (id, name, location, status, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 3341 (class 2606 OID 17938)
-- Name: clinics clinics_nit_key; Type: CONSTRAINT; Schema: public; Owner: luis
--

ALTER TABLE ONLY public.clinics
    ADD CONSTRAINT clinics_nit_key UNIQUE (nit);


--
-- TOC entry 3343 (class 2606 OID 17936)
-- Name: clinics clinics_pkey; Type: CONSTRAINT; Schema: public; Owner: luis
--

ALTER TABLE ONLY public.clinics
    ADD CONSTRAINT clinics_pkey PRIMARY KEY (id);


--
-- TOC entry 3349 (class 2606 OID 17966)
-- Name: medicines medicines_name_key; Type: CONSTRAINT; Schema: public; Owner: luis
--

ALTER TABLE ONLY public.medicines
    ADD CONSTRAINT medicines_name_key UNIQUE (name);


--
-- TOC entry 3351 (class 2606 OID 17964)
-- Name: medicines medicines_pkey; Type: CONSTRAINT; Schema: public; Owner: luis
--

ALTER TABLE ONLY public.medicines
    ADD CONSTRAINT medicines_pkey PRIMARY KEY (id);


--
-- TOC entry 3353 (class 2606 OID 17980)
-- Name: requests requests_pkey; Type: CONSTRAINT; Schema: public; Owner: luis
--

ALTER TABLE ONLY public.requests
    ADD CONSTRAINT requests_pkey PRIMARY KEY (id);


--
-- TOC entry 3337 (class 2606 OID 17923)
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: luis
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- TOC entry 3339 (class 2606 OID 17921)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: luis
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- TOC entry 3355 (class 2606 OID 18001)
-- Name: warehouse_stocks warehouse_stocks_pkey; Type: CONSTRAINT; Schema: public; Owner: luis
--

ALTER TABLE ONLY public.warehouse_stocks
    ADD CONSTRAINT warehouse_stocks_pkey PRIMARY KEY (id);


--
-- TOC entry 3345 (class 2606 OID 17952)
-- Name: warehouses warehouses_name_key; Type: CONSTRAINT; Schema: public; Owner: luis
--

ALTER TABLE ONLY public.warehouses
    ADD CONSTRAINT warehouses_name_key UNIQUE (name);


--
-- TOC entry 3347 (class 2606 OID 17950)
-- Name: warehouses warehouses_pkey; Type: CONSTRAINT; Schema: public; Owner: luis
--

ALTER TABLE ONLY public.warehouses
    ADD CONSTRAINT warehouses_pkey PRIMARY KEY (id);


--
-- TOC entry 3356 (class 2606 OID 17981)
-- Name: requests requests_clinic_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: luis
--

ALTER TABLE ONLY public.requests
    ADD CONSTRAINT requests_clinic_id_fkey FOREIGN KEY (clinic_id) REFERENCES public.clinics(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3357 (class 2606 OID 17986)
-- Name: requests requests_medicine_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: luis
--

ALTER TABLE ONLY public.requests
    ADD CONSTRAINT requests_medicine_id_fkey FOREIGN KEY (medicine_id) REFERENCES public.medicines(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3358 (class 2606 OID 17991)
-- Name: requests requests_warehouse_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: luis
--

ALTER TABLE ONLY public.requests
    ADD CONSTRAINT requests_warehouse_id_fkey FOREIGN KEY (warehouse_id) REFERENCES public.warehouses(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3359 (class 2606 OID 18007)
-- Name: warehouse_stocks warehouse_stocks_medicine_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: luis
--

ALTER TABLE ONLY public.warehouse_stocks
    ADD CONSTRAINT warehouse_stocks_medicine_id_fkey FOREIGN KEY (medicine_id) REFERENCES public.medicines(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3360 (class 2606 OID 18002)
-- Name: warehouse_stocks warehouse_stocks_warehouse_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: luis
--

ALTER TABLE ONLY public.warehouse_stocks
    ADD CONSTRAINT warehouse_stocks_warehouse_id_fkey FOREIGN KEY (warehouse_id) REFERENCES public.warehouses(id) ON UPDATE CASCADE ON DELETE CASCADE;


-- Completed on 2026-08-31 17:47:47 -05

--
-- PostgreSQL database dump complete
--

\unrestrict o4QHy8EJFBJ7fqRFgjF7FOdCJo4ol17nZh77LFyNMRtKsz424LjDaeaKVVeklnc

