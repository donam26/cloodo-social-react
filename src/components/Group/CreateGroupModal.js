import { Modal, Form, Input, Upload, Button, Radio, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useCreateGroup } from "../../hooks/groupHook";

const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

const CreateGroupModal = ({ open, onClose }) => {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");

  const { mutate: createGroup, isPending } = useCreateGroup();

  const { control, handleSubmit, setValue, reset, formState: { errors } } = useForm({
    defaultValues: {
      name: "",
      description: "",
      status: "public",
      image: null,
    },
  });

  const handleCancel = () => setPreviewOpen(false);

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
    setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf("/") + 1));
  };

  const handleChange = async ({ fileList }) => {
    if (fileList.length > 0) {
      const file = fileList[fileList.length - 1];
      if (file.size > 5 * 1024 * 1024) {
        message.error("Ảnh không được lớn hơn 5MB!");
        return;
      }
      const base64 = await getBase64(file.originFileObj);
      setValue("image", base64);
    } else {
      setValue("image", null);
    }
  };

  const onSubmit = async (data) => {
    try {
      await createGroup(data, {
        onSuccess: () => {
          message.success("Tạo nhóm thành công!");
          reset();
          onClose();
        },
        onError: (error) => {
          message.error("Có lỗi xảy ra khi tạo nhóm!");
          console.error("Error creating group:", error);
        },
      });
    } catch (error) {
      message.error("Có lỗi xảy ra!");
      console.error("Error:", error);
    }
  };

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Tải ảnh lên</div>
    </div>
  );

  return (
    <>
      <Modal
        title="Tạo nhóm mới"
        open={open}
        onCancel={!isPending ? onClose : undefined}
        footer={[
          <Button key="back" onClick={onClose} disabled={isPending}>
            Hủy
          </Button>,
          <Button
            key="submit"
            type="primary"
            loading={isPending}
            onClick={handleSubmit(onSubmit)}
          >
            Tạo nhóm
          </Button>,
        ]}
        width={600}
      >
        <Form layout="vertical" className="py-4">
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <Form.Item
                label="Tên nhóm"
                validateStatus={errors.name ? "error" : ""}
                help={errors.name?.message}
              >
                <Input {...field} placeholder="Nhập tên nhóm" />
              </Form.Item>
            )}
          />

          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <Form.Item
                label="Mô tả"
                validateStatus={errors.description ? "error" : ""}
                help={errors.description?.message}
              >
                <Input.TextArea
                  {...field}
                  placeholder="Mô tả về nhóm của bạn"
                  autoSize={{ minRows: 3, maxRows: 5 }}
                />
              </Form.Item>
            )}
          />

          <Controller
            name="status"
            control={control}
            render={({ field }) => (
              <Form.Item
                label="Quyền riêng tư"
                validateStatus={errors.status ? "error" : ""}
                help={errors.status?.message}
              >
                <Radio.Group {...field}>
                  <Radio.Button value="public">Công khai</Radio.Button>
                  <Radio.Button value="private">Riêng tư</Radio.Button>
                </Radio.Group>
              </Form.Item>
            )}
          />

          <Form.Item
            label="Ảnh nhóm"
            validateStatus={errors.image ? "error" : ""}
            help={errors.image?.message}
          >
            <Upload
              listType="picture-card"
              maxCount={1}
              onPreview={handlePreview}
              onChange={handleChange}
              beforeUpload={() => false}
            >
              {uploadButton}
            </Upload>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        open={previewOpen}
        title={previewTitle}
        footer={null}
        onCancel={handleCancel}
      >
        <img alt="example" style={{ width: "100%" }} src={previewImage} />
      </Modal>
    </>
  );
};

export default CreateGroupModal; 