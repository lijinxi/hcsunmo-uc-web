package com.hc.scm.uc.web.file.json.controller;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.hc.scm.common.base.service.BaseCrudService;
import com.hc.scm.common.base.web.BaseCrudController;
import com.hc.scm.uc.dao.file.json.model.City;
import com.hc.scm.uc.file.json.service.FileToJsonCityService;


@Controller
@RequestMapping("/hc_file_json_city_list")
public class FileToJsonCityController extends BaseCrudController<City> {

	@Resource
    private  FileToJsonCityService  fileToJsonCityService;
	@Override
	protected BaseCrudService init() {
		// TODO Auto-generated method stub
		return fileToJsonCityService;
	}
    @RequestMapping("/city.json")
    @ResponseBody
    public Map<String,Object> add(HttpServletRequest req, Model model) throws Exception {
    	 Map<String, Object> resultMap =new HashMap<String, Object>();
    	 List<City> list=new  ArrayList<City>();
    	 System.out.println("你好吗");
    	 System.out.println(req.getParameter("provinceNo"));
    	 String  provinceNo=req.getParameter("provinceNo").toString();
    	 list= fileToJsonCityService.getCityList(provinceNo);
    	 System.out.println("你好吗"+list.size());
    	 resultMap.put("list",list);
    	return resultMap;
   }

}
