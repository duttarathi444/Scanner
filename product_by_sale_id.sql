BEGIN
DECLARE parent_id INT;

SET parent_id=(SELECT ch.parent_cust_id FROM customer_hirerarchy ch WHERE ch.cust_id=(SELECT product_sale_master.customer_id FROM product_sale_master WHERE product_sale_master.p_sale_id=p_sale_id));
IF(parent_id>0)THEN

	SELECT psm.p_sale_id,
	psd.product_id,
    psd.received_date,
    psd.product_quantity,
    psd.product_barcode,
    ps.customer_stock,
    psm.user_id,
    psm.prd_sale_date,
    psm.customer_id,
    psm.sap_order_no,
    psm.device_reg,
    psm.device_reg_date,
    psm.pe1_date,
    psm.pe1_status,
    psm.pe2_date,
    psm.pe2_status,
    psm.pe3_date,
    psm.pe3_status,
    pm.product_id,
    pm.product_name,
    pm.product_type,
    pm.product_code,
    pm.product_colr,
    cr.sl_no,
    cr.f_name,
    cr.l_name,
    cr.mail_id,
    cr.ph_no,
    cr.postal_code,
    customer_reg.f_name AS fname,
    customer_reg.l_name AS lname,
    customer_reg.mail_id AS email,
    customer_reg.ph_no AS phone_no,
    customer_reg.postal_code AS p_postal_code
    FROM 
    product_sale_master psm,
    customer_reg cr INNER JOIN customer_reg,
    product_stock_details psd,
    product_stock ps 
    WHERE cr.sl_no = psm.customer_id AND 
    psm.p_sale_id = p_sale_id AND 
    psd.product_stock_details_id = p_st_d_id AND 
    customer_reg.sl_no = parent_id AND 
    psd.p_sale_id = psm.p_sale_id AND 
    psd.product_barcode!='' AND 
    psd.swap_id<1 AND 
    ps.product_id = psd.product_id AND 
    psd.product_id = p_prd_id AND 
    psm.user_id = p_user_id;

ELSE

	SELECT psm.p_sale_id,
	psd.product_id,
    psd.received_date,
    psd.product_quantity,
    psd.product_barcode,
    ps.customer_stock,
    psm.user_id,
    psm.prd_sale_date,
    psm.customer_id,
    psm.sap_order_no,
    psm.device_reg,
    psm.device_reg_date,
    psm.pe1_date,
    psm.pe1_status,
    psm.pe2_date,
    psm.pe2_status,
    psm.pe3_date,
    psm.pe3_status,
    cr.sl_no,
    cr.f_name AS fname,
    cr.l_name AS lname,
    cr.mail_id AS email,
    cr.ph_no AS phone_no,
    pm.product_id,
    pm.product_name,
    pm.product_type,
    pm.product_code,
    pm.product_colr,
    cr.postal_code AS p_postal_code 
    FROM product_sale_master psm,
    customer_reg cr,
    product_stock ps,
    product_master pm,
    product_stock_details psd 
    WHERE cr.sl_no = psm.customer_id AND 
    psm.p_sale_id = p_sale_id AND 
    psd.product_stock_details_id = p_st_d_id AND 
    psd.p_sale_id = psm.p_sale_id AND 
    psd.product_barcode!='' AND 
    psd.swap_id<1 AND 
    ps.product_id=psd.product_id AND 
    pm.product_id = psd.product_id AND 
    psd.product_id = p_prd_id AND 
	psm.user_id = p_user_id;
END IF;
END
