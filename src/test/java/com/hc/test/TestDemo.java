package com.hc.test;

import java.io.File;
import java.io.FileNotFoundException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Scanner;

import javax.annotation.Resource;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import com.hc.scm.common.constans.SysConstans;
import com.hc.scm.uc.dao.file.json.model.Province;
import com.hc.scm.uc.file.json.service.FileToJsonProvinceService;
import com.hc.scm.uc.service.ItgLoginUserService;
import com.hc.scm.uc.service.ItgMenuListService;
import com.hc.scm.uc.web.purchasing.controller.HcSupplierManagementController;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(locations = "classpath:META-INF/ApplicationContext.xml")
@ActiveProfiles(profiles = {"springTest"})
public class TestDemo {
	    
	    @Resource
	    private HcSupplierManagementController hcSupplierManagementController;  
	    @Resource
	    private   FileToJsonProvinceService  fileToJsonProvinceService;
	    @Test
	    public void saveTest() {
	    	List<Province>  list=new ArrayList<Province>();
	      try {
	    	  list=fileToJsonProvinceService.getProvinceList();
	    	  for(int i=0;i<list.size();i++){
	     		 System.out.println(list.get(i).getProvinceName());
	     	 }
		//	System.out.println("--------22222222222222------------"+hcSupplierManagementController.listAll(null, null, null));
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	      
	 
	    }
}
