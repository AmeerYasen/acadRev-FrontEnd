# 🧪 Evidence Management Features - Testing Guide

## **Quick Test Checklist**

### **1. Access the Updated Page**
- Navigate to: `http://localhost:5003/qualitative/1`
- Verify page loads without errors
- Confirm evaluation modal opens correctly

### **2. Test Evidence Action Buttons**

#### **Notes Button Testing**
- [ ] Click "Notes" button on any indicator
- [ ] Verify notes modal opens
- [ ] Type text in notes area and verify character/word count updates
- [ ] Close modal and reopen - verify notes are preserved
- [ ] Verify notes button shows character count badge when notes exist

#### **Upload Button Testing**
- [ ] Click "Upload" button
- [ ] Verify file picker opens
- [ ] Select multiple files and verify they appear in evidence summary
- [ ] Verify upload button shows evidence count badge

#### **View All Button Testing**
- [ ] Click "View All" button  
- [ ] Verify comprehensive evidence modal opens
- [ ] Confirm all evidence types are visible in unified interface

### **3. Test Drag & Drop Functionality**

#### **Drag & Drop Zone**
- [ ] Open notes/evidence modal
- [ ] Drag files from Windows Explorer over the drop zone
- [ ] Verify visual feedback (border color change, background highlight)
- [ ] Drop files and verify they are added to evidence list
- [ ] Verify file details show (name, size, type)

#### **File Management**
- [ ] Upload multiple files
- [ ] Click trash icon on individual files
- [ ] Verify files are removed from list
- [ ] Verify evidence counters update correctly

### **4. Test URL Resource Links**

#### **URL Addition**
- [ ] Open evidence modal
- [ ] Enter a valid URL in the URL input field
- [ ] Click "+" button or press Enter
- [ ] Verify URL appears in links list with external link icon
- [ ] Test with various URL formats (http, https, www)

#### **URL Management**  
- [ ] Add multiple URLs
- [ ] Click on URL links to verify they open in new tab
- [ ] Click trash icon to remove URLs
- [ ] Verify URL counters update correctly

### **5. Test Evidence Counters & Badges**

#### **Real-time Counters**
- [ ] Start with no evidence
- [ ] Add files and verify Upload button badge updates
- [ ] Add notes and verify Notes button badge updates  
- [ ] Add URLs and verify View All button shows total count
- [ ] Remove evidence and verify counters decrease

#### **Evidence Summary Display**
- [ ] Add mixed evidence types (files + URLs + notes)
- [ ] Verify evidence summary shows correct breakdown
- [ ] Check color-coded badges for different evidence types
- [ ] Verify total count matches individual counters

### **6. Test Modal Interactions**

#### **Notes Modal**
- [ ] Open notes modal
- [ ] Verify backdrop blur effect
- [ ] Click backdrop to close modal
- [ ] Click X button to close modal
- [ ] Verify modal state is properly reset

#### **Evidence Modal**
- [ ] Open evidence modal with notes and files
- [ ] Verify two-column layout (notes left, evidence right)
- [ ] Test scrolling in file/URL lists when many items added
- [ ] Verify footer shows accurate evidence counts

### **7. Test Responsive Design**

#### **Desktop View**
- [ ] Verify all buttons are properly sized and spaced
- [ ] Confirm modal layouts work correctly
- [ ] Check evidence summary formatting

#### **Mobile View** (resize browser or use dev tools)
- [ ] Verify buttons stack properly on smaller screens
- [ ] Confirm modals are responsive and usable
- [ ] Check touch interactions work for file upload

### **8. Test Integration with Evaluation**

#### **Evaluation Workflow**
- [ ] Select Yes/Maybe/No response
- [ ] Add evidence (files, URLs, notes)
- [ ] Verify evidence persists when switching between indicators
- [ ] Confirm evidence is associated with correct indicator
- [ ] Test evidence persistence when switching domains

### **9. Test Error Handling**

#### **File Upload Errors**
- [ ] Try uploading unsupported file types
- [ ] Test with very large files
- [ ] Verify appropriate error handling/feedback

#### **URL Validation**
- [ ] Try adding invalid URLs
- [ ] Test empty URL submission
- [ ] Verify proper validation feedback

### **10. Test Performance**

#### **Large Evidence Sets**
- [ ] Add 10+ files to single indicator
- [ ] Add 10+ URLs to single indicator
- [ ] Verify UI remains responsive
- [ ] Check scrolling performance in evidence lists

## **🎯 Expected Results**

### **Evidence Management**
- ✅ Files upload successfully via drag & drop and file picker
- ✅ URLs are added and displayed with proper formatting
- ✅ Evidence counters update in real-time
- ✅ Individual evidence items can be removed
- ✅ Evidence persists across modal opens/closes

### **UI/UX**
- ✅ Smooth animations and transitions
- ✅ Proper visual feedback for all interactions
- ✅ Professional, consistent styling
- ✅ Responsive design across screen sizes
- ✅ Accessible modal management

### **Integration**
- ✅ Evidence properly associated with indicators
- ✅ Auto-save functionality works correctly
- ✅ Evidence persists when switching domains/indicators
- ✅ Proper state management across components

## **🐛 Common Issues to Watch For**

1. **File Upload**: Ensure drag & drop works across different browsers
2. **URL Validation**: Check various URL formats are accepted
3. **State Management**: Verify evidence doesn't get lost between modal opens
4. **Performance**: Monitor responsiveness with large evidence sets
5. **Mobile**: Test touch interactions for file upload and modal controls

## **📝 Test Results Template**

```
EVIDENCE MANAGEMENT TESTING - [Date]

✅ Notes Modal: Working
✅ File Upload (Drag & Drop): Working  
✅ File Upload (File Picker): Working
✅ URL Addition: Working
✅ Evidence Counters: Working
✅ Evidence Removal: Working
✅ Modal Interactions: Working
✅ Responsive Design: Working
✅ Integration with Evaluation: Working
✅ Error Handling: Working

Issues Found:
- [List any issues here]

Overall Status: ✅ PASS / ❌ FAIL
```

## **🚀 Ready for Production**

When all tests pass:
- Evidence management is fully functional
- UI/UX meets professional standards  
- Integration with existing evaluation workflow is seamless
- Performance is acceptable for typical usage
- Error handling is robust

**The enhanced QualitativeMain page is ready for stakeholder review and production deployment.**
