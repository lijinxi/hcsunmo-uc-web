package com.hc.scm.uc.web.file.json.controller;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.hc.scm.common.base.service.BaseCrudService;
import com.hc.scm.common.base.web.BaseCrudController;
import com.hc.scm.uc.dao.file.json.model.Province;
import com.hc.scm.uc.file.json.service.FileToJsonProvinceService;


@Controller
@RequestMapping("/hc_file_json_province_list")
public class FileToJsonProvinceController extends BaseCrudController<Province> {
	
	@Resource
    private   FileToJsonProvinceService  fileToJsonProvinceService;
	@Override
	protected BaseCrudService init() {
		// TODO Auto-generated method stub
		return fileToJsonProvinceService;
	}
	
    @RequestMapping("/province.json")
    @ResponseBody
    public Map<String,Object> add() throws Exception {
    	 Map<String, Object> resultMap =new HashMap<String, Object>();
    	 List<Province> list=new  ArrayList<Province>();
    	 list= fileToJsonProvinceService.getProvinceList();
    	 resultMap.put("list",list);
    	return resultMap;
   }

}
