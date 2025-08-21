package com.example.eventapp.file;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

@Service
public class FileStorageService {
	private final Path root;

	public FileStorageService(@Value("${app.file.upload-dir}") String uploadDir) throws IOException {
		this.root = Paths.get(uploadDir)
				.toAbsolutePath();
		Files.createDirectories(this.root);
	}

	public String store(MultipartFile file) throws IOException {
		if (file.isEmpty())
			throw new IOException("Empty file");
		String ext = StringUtils.getFilenameExtension(file.getOriginalFilename());
		String name = UUID.randomUUID() + (ext != null ? "." + ext : "");
		Path target = root.resolve(name);
		Files.copy(file.getInputStream(), target, StandardCopyOption.REPLACE_EXISTING);
		return name;
	}

	public Path load(String filename) {
		return root.resolve(filename);
	}
}
