package com.hc.test;

import java.util.HashMap;
import java.util.Map;

import javax.annotation.Resource;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import com.hc.scm.common.constans.SysConstans;
import com.hc.scm.uc.service.ItgLoginUserService;
import com.hc.scm.uc.service.ItgMenuListService;
import com.hc.scm.uc.web.purchasing.controller.HcSupplierManagementController;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(locations = "classpath:META-INF/ApplicationContext.xml")
@ActiveProfiles(profiles = {"springTest"})
public class TestDemo {
	    
	    @Resource
	    private HcSupplierManagementController hcSupplierManagementController;  
	    @Test
	    public void saveTest() {
	    
	      try {
		//	System.out.println("--------22222222222222------------"+hcSupplierManagementController.listAll(null, null, null));
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	    }
}
